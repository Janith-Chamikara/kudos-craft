'use server';

import { axiosPublic } from '@/lib/axios';
import { isAxiosError } from 'axios';
import { getServerSession } from 'next-auth';
import { FieldValues } from 'react-hook-form';
import { authOptions } from './auth-options';
import {
  CreateReviewFormInputs,
  CreateWorkspaceFormInputs,
  RequestTestimonialFormInputs,
} from './types';
import { FilterState } from '@/components/FilterDropdown';

export type Status = {
  status: 'default' | 'success' | 'error';
  message: string;
  data?: object;
};

//auth actions
export const loginAction = async (data: FieldValues) => {
  try {
    const response = await axiosPublic.post('/auth/sign-in', data);
    console.log(response.data);
    const accessToken = response.data.accessToken;
    const refreshToken = response.data.refreshToken;
    const accessTokenExpiresIn = response.data.accessTokenExpiresIn;
    const refreshTokenExpiresIn = response.data.refreshTokenExpiresIn;
    return {
      data: {
        user: { ...response.data.user },
        tokenInfo: {
          accessToken,
          refreshToken,
          accessTokenExpiresIn,
          refreshTokenExpiresIn,
        },
      },
      message: response.data.message,
      status: 'success',
    } as Status;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        message: error.response?.data.message,
        status: 'error',
      } as Status;
    }
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axiosPublic.get('/auth/refresh', {
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });
    console.log(response);
    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken;
    const newAccessTokenExpiresIn = response.data.accessTokenExpiresIn;
    const newRefreshTokenExpiresIn = response.data.refreshTokenExpiresIn;

    return {
      data: {
        accessToken: newAccessToken,
        accessTokenExpiresIn: newAccessTokenExpiresIn,
        refreshToken: newRefreshToken,
        refreshTokenExpiresIn: newRefreshTokenExpiresIn,
      },
      message: response.data.message,
      status: 'success',
    } as Status;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return {
        message: error.response?.data.message,
        status: 'error',
      } as Status;
    }
  }
};

export const signUpAction = async (data: FieldValues) => {
  console.log(data);
  try {
    const { email, firstName, lastName, password } = data;
    const response = await axiosPublic.post('/auth/sign-up', {
      email,
      firstName,
      lastName,
      password,
    });
    console.log(response.data);
    return {
      status: 'success',
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return {
        status: 'error',
        message: error.response?.data.message,
      } as Status;
    }
  }
};

//account-setup
export const setupAccountDetails = async (data: FieldValues) => {
  const session = await getServerSession(authOptions);
  try {
    const response = await axiosPublic.post('/user/account-setup', data, {
      headers: {
        Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
        Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
      },
    });
    return {
      status: 'success',
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return {
        status: 'error',
        message: error.response?.data.message,
      } as Status;
    }
  }
};

//workspace actions
export const createWorkspace = async (data: CreateWorkspaceFormInputs) => {
  const session = await getServerSession(authOptions);
  try {
    const response = await axiosPublic.post('/workspace/create', data, {
      headers: {
        Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
        Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
      },
    });
    return {
      status: 'success',
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return {
        status: 'error',
        message: error.response?.data.message,
      } as Status;
    }
  }
};
export const getAllWorkspaces = async (filters: FilterState) => {
  console.log(filters);
  const session = await getServerSession(authOptions);
  try {
    const response = await axiosPublic.post(
      `/workspace/user/get-all?userId=${session?.user.id}`,
      filters,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      },
    );
    console.log(response.data);
    return {
      status: 'success',
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return {
        status: 'error',
        message: error.response?.data.message,
      } as Status;
    }
  }
};
export const getWorkspaceById = async (workspaceId: string) => {
  const session = await getServerSession(authOptions);
  try {
    const response = await axiosPublic.get(
      `/workspace/get-one?workspaceId=${workspaceId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      },
    );
    return {
      status: 'success',
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return {
        status: 'error',
        message: error.response?.data.message,
      } as Status;
    }
  }
};
export const deleteWorkspace = async (workspaceId: string) => {
  const session = await getServerSession(authOptions);
  try {
    const response = await axiosPublic.delete(
      `/workspace/delete?workspaceId=${workspaceId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      },
    );
    return {
      status: 'success',
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return {
        status: 'error',
        message: error.response?.data.message,
      } as Status;
    }
  }
};

//review actions
export const createReview = async (data: CreateReviewFormInputs) => {
  const session = await getServerSession(authOptions);
  try {
    const response = await axiosPublic.post('/testimonial/create', data, {
      headers: {
        Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
        Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
      },
    });
    console.log(response);
    return {
      status: 'success',
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return {
        status: 'error',
        message: error.response?.data.message,
      } as Status;
    }
  }
};

export const requestReviewBySendingEmail = async (
  data: RequestTestimonialFormInputs,
) => {
  const session = await getServerSession(authOptions);
  try {
    const response = await axiosPublic.post('/testimonial/share', data, {
      headers: {
        Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
        Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
      },
    });
    console.log(response);
    return {
      status: 'success',
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return {
        status: 'error',
        message: error.response?.data.message,
      } as Status;
    }
  }
};

export const getAllTestimonialsByWorkspaceId = async (
  workspaceId: string,
  filters: FilterState,
) => {
  const session = await getServerSession(authOptions);
  try {
    const response = await axiosPublic.post(
      `/testimonial/workspace/get-all?workspaceId=${workspaceId}`,
      filters,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      },
    );
    return {
      status: 'success',
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return {
        status: 'error',
        message: error.response?.data.message,
      } as Status;
    }
  }
};
export const getAllTestimonials = async () => {
  const session = await getServerSession(authOptions);
  try {
    const response = await axiosPublic.get(
      `/testimonial/get-all?userId=${session?.user.id}`,
      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      },
    );
    return {
      status: 'success',
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return {
        status: 'error',
        message: error.response?.data.message,
      } as Status;
    }
  }
};
export const getAnalyticsOfTestimonialOverTime = async () => {
  const session = await getServerSession(authOptions);
  try {
    const response = await axiosPublic.get(`/testimonial/count-over-time`, {
      headers: {
        Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
        Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
      },
    });
    return {
      status: 'success',
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return {
        status: 'error',
        message: error.response?.data.message,
      } as Status;
    }
  }
};
export const getAnalyticsOfSentimentOverTime = async () => {
  const session = await getServerSession(authOptions);
  try {
    const response = await axiosPublic.get(`/testimonial/sentiment-over-time`, {
      headers: {
        Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
        Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
      },
    });
    return {
      status: 'success',
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return {
        status: 'error',
        message: error.response?.data.message,
      } as Status;
    }
  }
};

export const analyzeAllTestimonialsByWorkspaceId = async () => {
  const session = await getServerSession(authOptions);
  try {
    const response = await axiosPublic.get(
      `/testimonial/analyze?userId=${session?.user.id}`,

      {
        headers: {
          Authorization: `Bearer ${session?.tokenInfo.accessToken}`,
          Cookie: `refreshToken=${session?.tokenInfo.refreshToken}`,
        },
      },
    );
    return {
      status: 'success',
      data: response.data,
      message: response.data.message as string,
    } as Status;
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return {
        status: 'error',
        message: error.response?.data.message,
      } as Status;
    }
  }
};
