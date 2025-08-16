// "use client";

// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   CircularProgress,
//   Alert,
//   IconButton,
//   InputAdornment,
//   Link,
//   Divider,
// } from "@mui/material";
// import {
//   Visibility,
//   VisibilityOff,
//   Email as EmailIcon,
//   Lock as LockIcon,
// } from "@mui/icons-material";
// import { AxiosError } from "axios";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";

// // Types
// interface LoginFormInputs {
//   email: string;
//   password: string;
// }

// interface LoginResponse {
//   token?: string;
//   message?: string;
//   status?: boolean;
//   data?: {
//     user?: {
//       id: string;
//       email: string;
//       first_name?: string;
//       last_name?: string;
//     };
//     token?: string;
//   };
// }

// interface ApiError {
//   message?: string;
//   errors?: Record<string, string[]>;
//   status?: number;
// }

// // Validation Schema
// const schema = yup.object().shape({
//   email: yup
//     .string()
//     .email("Please enter a valid email address")
//     .required("Email is required")
//     .trim()
//     .lowercase(),
//   password: yup
//     .string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
// });

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL ||
//   "https://wtsacademy.dedicateddevelopers.us/api";

// const Login: React.FC = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [showPassword, setShowPassword] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     setError,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginFormInputs>({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//     mode: "onBlur",
//   });

//   // Store token & user data
//   const storeAuthData = (token: string, userData?: object) => {
//     if (typeof window !== "undefined") {
//       try {
//         const authData = {
//           token,
//           user: userData || {},
//           timestamp: Date.now(),
//           expiresIn: 24 * 60 * 60 * 1000,
//         };

//         localStorage.setItem("authToken", JSON.stringify(authData));
//         localStorage.setItem("token", token);
//       } catch (error) {
//         console.error("Failed to store authentication data:", error);
//         toast.error("Failed to save login session");
//       }
//     }
//   };

//   // Mutation
//   const mutation = useMutation<
//     LoginResponse,
//     AxiosError<ApiError>,
//     LoginFormInputs
//   >({
//     mutationFn: async (data) => {
//       const response = await axios.post<LoginResponse>(
//         `${API_BASE_URL}/user/signin`,
//         {
//           email: data.email.toLowerCase().trim(),
//           password: data.password,
//         },
//         {
//           timeout: 15000,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       return response.data;
//     },

//     onSuccess: (data) => {
//       const token = data.token || data.data?.token;
//       const userData = data.data?.user;

//       if (token) {
//         storeAuthData(token, userData);
//         toast.success(data.message || "Login successful!");
//         reset();

//         const redirectTo = searchParams.get("redirect") || "/ai";
//         setTimeout(() => {
//           router.push(redirectTo);
//         }, 500);
//       } else {
//         toast.error("Login failed: No authentication token received");
//       }
//     },

//     onError: (error) => {
//       console.error("Login error:", error);

//       if (error.response?.data) {
//         const apiError = error.response.data;

//         if (apiError.errors) {
//           Object.entries(apiError.errors).forEach(([field, messages]) => {
//             if (Array.isArray(messages) && messages.length > 0) {
//               setError(field as keyof LoginFormInputs, {
//                 type: "server",
//                 message: messages[0],
//               });
//             }
//           });
//           return;
//         }

//         switch (error.response.status) {
//           case 401:
//             toast.error("Invalid email or password");
//             break;
//           case 403:
//             toast.error("Account is suspended. Please contact support.");
//             break;
//           case 429:
//             toast.error("Too many login attempts. Please try again later.");
//             break;
//           case 500:
//             toast.error("Server error. Please try again later.");
//             break;
//           default:
//             toast.error(apiError.message || "Login failed");
//         }
//       } else if (error.request) {
//         toast.error("Network error. Please check your connection.");
//       } else {
//         toast.error("An unexpected error occurred.");
//       }
//     },
//   });

//   const onSubmit = async (data: LoginFormInputs) => {
//     await mutation.mutateAsync(data);
//   };

//   return (
//     <Box
//       component="main"
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         bgcolor: "grey.50",
//         py: 24,
//       }}
//     >
//       <Box
//         maxWidth={420}
//         width="100%"
//         mx="auto"
//         p={4}
//         sx={{
//           bgcolor: "white",
//           borderRadius: 2,
//           boxShadow: 3,
//         }}
//       >
//         <Box textAlign="center" mb={4}>
//           <Typography variant="h4" fontWeight="bold">
//             Welcome Back
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Sign in to your account to continue
//           </Typography>
//         </Box>

//         <form onSubmit={handleSubmit(onSubmit)} noValidate>
//           {/* Email */}
//           <Controller
//             name="email"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 label="Email Address"
//                 type="email"
//                 fullWidth
//                 margin="normal"
//                 variant="outlined"
//                 error={!!errors.email}
//                 helperText={errors.email?.message}
//                 disabled={mutation.isPending}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <EmailIcon
//                         color={errors.email ? "error" : "action"}
//                       />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             )}
//           />

//           {/* Password */}
//           <Controller
//             name="password"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 label="Password"
//                 type={showPassword ? "text" : "password"}
//                 fullWidth
//                 margin="normal"
//                 variant="outlined"
//                 error={!!errors.password}
//                 helperText={errors.password?.message}
//                 disabled={mutation.isPending}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <LockIcon
//                         color={errors.password ? "error" : "action"}
//                       />
//                     </InputAdornment>
//                   ),
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         onClick={() =>
//                           setShowPassword((prev) => !prev)
//                         }
//                         edge="end"
//                         disabled={mutation.isPending}
//                       >
//                         {showPassword ? (
//                           <VisibilityOff />
//                         ) : (
//                           <Visibility />
//                         )}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             )}
//           />

//           <Box textAlign="right" mb={2}>
//             <Link href="/forgot-password" variant="body2">
//               Forgot your password?
//             </Link>
//           </Box>

//           <Button
//             type="submit"
//             variant="contained"
//             fullWidth
//             size="large"
//             disabled={mutation.isPending || isSubmitting}
//             sx={{
//               mt: 2,
//               mb: 2,
//               height: 48,
//               textTransform: "none",
//               fontSize: "1.1rem",
//             }}
//           >
//             {mutation.isPending ? (
//               <>
//                 <CircularProgress size={20} sx={{ mr: 1 }} />
//                 Signing in...
//               </>
//             ) : (
//               "Sign In"
//             )}
//           </Button>

//           {mutation.isError && (
//             <Alert severity="error" sx={{ mb: 2 }}>
//               Login failed. Please check your credentials.
//             </Alert>
//           )}
//         </form>

//         <Divider sx={{ my: 3 }}>
//           <Typography variant="body2" color="text.secondary">
//             OR
//           </Typography>
//         </Divider>

//         <Box textAlign="center">
//           <Typography variant="body2">
//             Don&apos;t have an account?{" "}
//             <Link href="/register" color="primary">
//               Create one here
//             </Link>
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Login;





"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Link,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { AxiosError } from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

// Types
interface LoginFormInputs {
  email: string;
  password: string;
}

interface LoginResponse {
  token?: string;
  message?: string;
  status?: boolean;
  data?: {
    user?: {
      id: string;
      email: string;
      first_name?: string;
      last_name?: string;
      name?: string; // Added name field
    };
    token?: string;
  };
}

interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Validation Schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required")
    .trim()
    .lowercase(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://wtsacademy.dedicateddevelopers.us/api";

const Login: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  // Store token & user data - Using auth utils
  const storeAuthData = (token: string, userData?: any) => {
    try {
      console.log("Storing auth data:", { token, userData }); // Debug log
      
      // Store the token for navbar compatibility
      localStorage.setItem("token", token);
      
      // Store user data if available
      if (userData) {
        const userProfile = {
          name: userData.name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email?.split('@')[0] || 'User',
          email: userData.email,
          id: userData.id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          avatar: userData.avatar || userData.profile_picture,
        };
        localStorage.setItem("userData", JSON.stringify(userProfile));
      }

      // Store complete auth for other perpous
      const authData = {
        token,
        user: userData || {},
        timestamp: Date.now(),
        expiresIn: 24 * 60 * 60 * 1000,
      };
      localStorage.setItem("authToken", JSON.stringify(authData));
      
      // Trigger navbar update
      window.dispatchEvent(new CustomEvent('auth-change'));
      
      console.log("Successfully stored authentication data"); // Debug log
    } catch (error) {
      console.error("Failed to store authentication data:", error);
      toast.error("Failed to save login session");
    }
  };

  // Mutation
  const mutation = useMutation<
    LoginResponse,
    AxiosError<ApiError>,
    LoginFormInputs
  >({
    mutationFn: async (data) => {
      console.log("Making login request with:", data); 
      const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}/user/signin`,
        {
          email: data.email.toLowerCase().trim(),
          password: data.password,
        },
        {
          timeout: 15000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login response:", response.data); 
      return response.data;
    },

    onSuccess: (data) => {
      console.log("Login successful, processing data:", data); 
      
      
      const token = data.token || data.data?.token;
      const userData = data.data?.user;

      console.log("Extracted token:", token);
      console.log("Extracted userData:", userData); 

      if (token) {
        storeAuthData(token, userData);
        toast.success(data.message || "Login successful!");
        reset();

        const redirectTo = searchParams.get("redirect") || "/";
        
        console.log("Redirecting to:", redirectTo); 
        
      
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 500);
      } else {
        console.error("No token found in response:", data); // Debug log
        toast.error("Login failed: No authentication token received");
        
        // Additional debugging - log the entire response structure
        console.log("Full response structure:", JSON.stringify(data, null, 2));
      }
    },

    onError: (error) => {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data); // Debug log

      if (error.response?.data) {
        const apiError = error.response.data;

        if (apiError.errors) {
          Object.entries(apiError.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              setError(field as keyof LoginFormInputs, {
                type: "server",
                message: messages[0],
              });
            }
          });
          return;
        }

        switch (error.response.status) {
          case 401:
            toast.error("Invalid email or password");
            break;
          case 403:
            toast.error("Account is suspended. Please contact support.");
            break;
          case 429:
            toast.error("Too many login attempts. Please try again later.");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error(apiError.message || "Login failed");
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.50",
        py: 24,
      }}
    >
      <Box
        maxWidth={420}
        width="100%"
        mx="auto"
        p={4}
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold">
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your account to continue
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email Address"
                type="email"
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={mutation.isPending}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon
                        color={errors.email ? "error" : "action"}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={mutation.isPending}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon
                        color={errors.password ? "error" : "action"}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        edge="end"
                        disabled={mutation.isPending}
                      >
                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Box textAlign="right" mb={2}>
            <Link href="/forgot-password" variant="body2">
              Forgot your password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={mutation.isPending || isSubmitting}
            sx={{
              mt: 2,
              mb: 2,
              height: 48,
              textTransform: "none",
              fontSize: "1.1rem",
            }}
          >
            {mutation.isPending ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Login failed. Please check your credentials.
            </Alert>
          )}
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Box textAlign="center">
          <Typography variant="body2">
            Don&apos;t have an account?{" "}
            <Link href="/register" color="primary">
              Create one here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;