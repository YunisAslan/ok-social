import { BadgeCheck, Loader2, MessageCircleIcon } from "lucide-react";
import { Button } from "./ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { useEffect, useState } from "react";
import { Input } from "./ui/Input";
import { editUserRequest, getUserByID } from "@/services/api/users";
import { useToast } from "@/hooks/use-toast";
import DefaultUserImg from "@/assets/images/default-user-img.png";

function PostCommentsModal({ post, currentUser }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [postComments, setPostComments] = useState(post?.comments || []);
  const [postCommentsCount, setPostCommentsCount] = useState(
    post?.comments?.length || 0
  );

  const [commentCreators, setCommentCreators] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const creators = {};
      for (const comment of postComments) {
        if (!creators[comment.creatorID]) {
          const creatorData = await getUserByID(comment.creatorID);
          creators[comment.creatorID] = creatorData;
        }
      }

      setCommentCreators(creators);
    };

    loadData();
  }, [postComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (commentValue.trim() == "") {
      toast({
        title: "Pls write some thing for comment",
      });
      return;
    }

    const postCreatorData = await getUserByID(post.creatorID);

    const newComment = {
      creatorID: currentUser.id || currentUser.userID,
      text: commentValue,
    };

    const updatedPost = {
      ...post,
      comments: [...post.comments, newComment],
    };

    setPostComments([...postComments, newComment]);
    setPostCommentsCount(() => postCommentsCount + 1);

    const updatedPosts = postCreatorData.posts.map((userPost) =>
      userPost.id === updatedPost.id ? updatedPost : userPost
    );

    console.log("current", updatedPosts);

    await editUserRequest(post.creatorID, {
      posts: updatedPosts.map((updatedPost) => ({
        id: updatedPost.id,
        title: updatedPost.title,
        imageURL: updatedPost.imageURL,
        likes: updatedPost.likes,
        date: updatedPost.date,
        comments: updatedPost?.comments,
        creatorID: updatedPost?.creatorID,
      })),
    });

    // reset
    setCommentValue("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <MessageCircleIcon />
        </Button>
      </DialogTrigger>
      <span>{post?.comments?.length}</span>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>

        <form
          className="py-2 flex gap-x-2 items-center"
          onSubmit={handleSubmit}
        >
          <Input
            placeholder="Your comment"
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
          />

          <Button
            type="submit"
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
          >
            send
          </Button>
        </form>

        <div className="pt-2 flex flex-col gap-y-2 max-h-[400px] overflow-y-auto">
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            postComments.map((comment, i) => {
              const commentCreator = commentCreators[comment.creatorID] || {};

              return (
                <div
                  key={i}
                  className="flex items-center justify-between hover:bg-accent px-2 py-1 rounded"
                >
                  <div className="border border-border w-full px-2 py-2 rounded-lg">
                    <div className="flex flex-col justify-start items-start gap-x-2">
                      <div className="flex items-center gap-x-2">
                        <div className="w-9 h-9 overflow-hidden rounded-full">
                          <img
                            src={
                              commentCreator?.profilePicture || DefaultUserImg
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h1 className="text-base font-semibold flex items-center">
                          {commentCreator?.username}
                          {commentCreator?.isVerified && (
                            <BadgeCheck className="stroke-[#4f3ed0] w-5 h-5" />
                          )}
                        </h1>
                      </div>

                      <div className="px-3 py-2">
                        <p className="text-lg text-muted-foreground">
                          <span>{comment?.text}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PostCommentsModal;
