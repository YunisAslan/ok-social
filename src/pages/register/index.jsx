import React from "react";
import ShakingHandsSvg from "@/assets/Illustrations/shaking-hands.svg";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="flex items-center">
      <div className="w-1/2">
        <img src={ShakingHandsSvg} alt="" className="w-full h-full" />
      </div>

      {/* login form */}
      <div className="w-1/2">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 mt-3">
          <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Sign in to your account
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                action=""
                // onSubmit={handleSubmit}
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Your name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Acme"
                    // value={values.name}
                    // onChange={handleChange}
                    // onBlur={handleBlur}
                  />
                  {/* {errors.name && touched.name ? (
                    <span className="text-sm text-red-500">{errors.name}</span>
                  ) : null} */}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    // value={values.password}
                    // onChange={handleChange}
                    // onBlur={handleBlur}
                  />
                  {/* {errors.password && touched.password ? (
                    <span className="text-sm text-red-500">
                      {errors.password}
                    </span>
                  ) : null} */}
                </div>

                <Button type="submit" className="w-full">
                  Sign in
                </Button>

                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet ?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-primary-600 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
