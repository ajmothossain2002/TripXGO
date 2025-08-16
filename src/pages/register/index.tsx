"use client";

import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Input,
  Alert,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Types
interface RegisterFormInputs {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  profile_pic: FileList | null;
}

interface ApiResponse {
  token?: string;
  message?: string;
  status?: boolean;
  data?: unknown;
}

interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Validation Schema
const schema = yup.object({
  first_name: yup
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "First name can only contain letters")
    .required("First name is required"),
  
  last_name: yup
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Last name can only contain letters")
    .required("Last name is required"),
  
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  
  profile_pic: yup
    .mixed<FileList>()
    .test("required", "Profile picture is required", (value) => {
      return value && value.length > 0;
    })
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (!value || value.length === 0) return true;
      return value[0].size <= 5 * 1024 * 1024; // 5MB
    })
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value || value.length === 0) return true;
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      return allowedTypes.includes(value[0].type);
    })
    .required("Profile picture is required"),
});

// Constants
const API_BASE_URL = "https://wtsacademy.dedicateddevelopers.us/api";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const RegisterForm: React.FC = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      profile_pic: null,
    },
  });

  // Utility function for secure token storage
  const storeToken = (token: string) => {
    if (typeof window !== "undefined") {
      try {
        // Store with expiration (24 hours)
        const tokenData = {
          token,
          timestamp: Date.now(),
          expiresIn: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        };
        localStorage.setItem("authToken", JSON.stringify(tokenData));
      } catch (error) {
        console.error("Failed to store token:", error);
        toast.error("Failed to save authentication data");
      }
    }
  };

  // API mutation
  const mutation = useMutation<ApiResponse, AxiosError<ApiError>, RegisterFormInputs>({
    mutationFn: async (formData) => {
      // Validate file before sending
      if (formData.profile_pic && formData.profile_pic.length > 0) {
        const file = formData.profile_pic[0];
        
        if (file.size > MAX_FILE_SIZE) {
          throw new Error("File size must be less than 5MB");
        }
        
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          throw new Error("Only JPEG, PNG, and WebP images are allowed");
        }
      }

      const payload = new FormData();
      payload.append("first_name", formData.first_name.trim());
      payload.append("last_name", formData.last_name.trim());
      payload.append("email", formData.email.toLowerCase().trim());
      payload.append("password", formData.password);
      
      if (formData.profile_pic && formData.profile_pic.length > 0) {
        payload.append("profile_pic", formData.profile_pic[0]);
      }

      const response = await axios.post<ApiResponse>(
        `${API_BASE_URL}/user/signup`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      return response.data;
    },
    
    onSuccess: (data) => {
      // Store token securely if provided
      if (data.token) {
        storeToken(data.token);
      }
      
      toast.success(data.message || "Registration successful!");
      reset();
      
      // Redirect after a short delay for better UX
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    },
    
    onError: (error) => {
      console.error("Registration error:", error);

      // Handle different types of errors
      if (error.response?.data) {
        const apiError = error.response.data;
        
        // Handle validation errors from API
        if (apiError.errors) {
          Object.entries(apiError.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              setError(field as keyof RegisterFormInputs, {
                type: "server",
                message: messages[0],
              });
            }
          });
          toast.error("Please check the form for errors");
          return;
        }
        
        // Handle general API errors
        const errorMessage = apiError.message || "Registration failed";
        toast.error(errorMessage);
      } else if (error.request) {
        // Network error
        toast.error("Network error. Please check your internet connection and try again.");
      } else {
        // Other errors
        toast.error(error.message || "An unexpected error occurred");
      }
    },
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      // Error is already handled in onError callback
      console.error("Form submission error:", error);
    }
  };

  return (
    <Box maxWidth={800} mx="auto" mt={9} p={7}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
        Create Account
      </Typography>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Please fill in all fields to create your account
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="first_name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="First Name"
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
              disabled={mutation.isPending}
              inputProps={{
                maxLength: 50,
                "aria-describedby": "first-name-helper",
              }}
              autoComplete="given-name"
            />
          )}
        />

        <Controller
          name="last_name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Last Name"
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
              disabled={mutation.isPending}
              inputProps={{
                maxLength: 50,
                "aria-describedby": "last-name-helper",
              }}
              autoComplete="family-name"
            />
          )}
        />

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
              autoComplete="email"
              inputProps={{
                "aria-describedby": "email-helper",
              }}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!errors.password}
              helperText={
                errors.password?.message ||
                "Must be at least 8 characters with uppercase, lowercase, and number"
              }
              disabled={mutation.isPending}
              autoComplete="new-password"
              inputProps={{
                "aria-describedby": "password-helper",
              }}
            />
          )}
        />

        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography variant="body2" component="label" htmlFor="profile-pic-input">
            Profile Picture *
          </Typography>
          <Controller
            name="profile_pic"
            control={control}
            render={({ field: { onChange, name } }) => (
              <Input
                id="profile-pic-input"
                name={name}
                type="file"
                fullWidth
                inputProps={{ 
                  accept: "image/jpeg,image/jpg,image/png,image/webp",
                  "aria-describedby": "profile-pic-helper",
                }}
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  onChange(target.files);
                }}
                disabled={mutation.isPending}
                sx={{ mt: 1 }}
              />
            )}
          />
          {errors.profile_pic && (
            <FormHelperText error id="profile-pic-helper">
              {errors.profile_pic.message}
            </FormHelperText>
          )}
          {!errors.profile_pic && (
            <FormHelperText id="profile-pic-helper">
              Max size: 5MB. Allowed formats: JPEG, PNG, WebP
            </FormHelperText>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ 
            mt: 3, 
            mb: 2, 
            height: 48,
            textTransform: 'none',
            fontSize: '1.1rem',
          }}
          disabled={mutation.isPending || isSubmitting}
          aria-describedby="submit-button-helper"
        >
          {mutation.isPending ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        {mutation.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Registration failed. Please check your information and try again.
          </Alert>
        )}
      </form>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
        Already have an account?{" "}
        <Button
          variant="text"
          onClick={() => router.push("/login")}
          sx={{ textTransform: 'none' }}
        >
          Sign In
        </Button>
      </Typography>
    </Box>
  );
};

export default RegisterForm;