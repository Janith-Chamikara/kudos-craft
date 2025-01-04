'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CreateReviewFormInputs } from '@/lib/types';
import { createReviewSchema } from '@/schemas/schema';
import FormField from '@/components/FormField';
import Image from 'next/image';
import avatar_img from '@public/avatar.jpeg';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { createReview } from '@/lib/actions';

const StarRating = ({
  rating,
  onRatingChange,
}: {
  rating: number;
  onRatingChange: (rating: number) => void;
}) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          onClick={() => onRatingChange(star)}
        />
      ))}
    </div>
  );
};

export default function ClientReviewForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const workspaceId = searchParams.get('workspaceId');
    if (!workspaceId) {
      toast.error('Invalid workspace id');
      setTimeout(() => {
        router.push('/');
      }, 3000);

      return;
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateReviewFormInputs>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      ratings: 0,
    },
  });

  console.log(errors);

  const onSubmit = async (data: CreateReviewFormInputs) => {
    console.log(data);
    toast.loading('Submitting your review');
    const requiredData = {
      ...data,
      workspaceId: searchParams.get('workspaceId'),
    };
    const response = await createReview(requiredData);
    if (response?.status === 'success') {
      toast.dismiss();
      toast.success(response.message);
    } else {
      toast.dismiss();
      toast.error(response?.message as string);
    }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-8">
          <div className="flex flex-col w-full justify-center items-center ">
            <Label
              htmlFor="profileImage"
              className="relative hover:cursor-pointer"
            >
              <Image
                src={imagePreview ? imagePreview : avatar_img}
                alt="User avatar"
                width={100}
                height={100}
                className="w-[100px] h-[100px] rounded-full shadow-lg"
              />
              <div className="p-[8px] w-[40px] h-[40px] absolute right-0 top-0  bg-white shadow-lg rounded-full">
                <Edit className="text-[#0091FF] w-[24px] h-[24px]" />
              </div>
            </Label>
            <Input
              id="profileImage"
              type="file"
              accept="image/*"
              // {...register('profileImage')}
              onChange={(e) => {
                register('profileImage').onChange(e);
                handleImageChange(e);
              }}
              className="hidden"
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="clientName">Your Name</Label>
            <FormField
              name="name"
              register={register}
              error={errors.name}
              placeholder="Your Name"
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="clientName">Your Email</Label>
            <FormField
              name="email"
              register={register}
              error={errors.email}
              placeholder="johndoe@gmail.com"
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="review">Your Review</Label>
            <FormField
              name="review"
              isTextArea
              register={register}
              error={errors.review}
              placeholder="Your Review"
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label>Rating</Label>
            <Controller
              name="ratings"
              control={control}
              render={({ field }) => (
                <StarRating
                  rating={field.value}
                  onRatingChange={field.onChange}
                />
              )}
            />
            {errors.ratings && (
              <p className="text-red-500 text-sm">{errors.ratings.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
