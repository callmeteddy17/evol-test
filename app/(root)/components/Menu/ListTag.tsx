'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppDispatch } from '@/lib/hooks';
import { setSearch } from '@/lib/redux/global/reducer';
import {
  Image as ImageType,
  Like,
  Post,
  TypePost,
  Video as VideoType,
} from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

type Props = {};

type PostQueryParams = {
  take?: number;
  lastCursor?: string;
  typePost: TypePost;
  search?: string;
};

export interface PostData extends Post {
  Image: ImageType[];
  Video: VideoType[];
  author: {
    name: string;
    image: string;
  };
  like: Like[];
  Comment: {
    id: string;
  }[];
}

const ListTag = (props: Props) => {
  const dispatch = useAppDispatch();
  const [tagList, setTagList] = useState<string[]>([]);
  const AllPost = async ({
    take,
    lastCursor,
    typePost,
    search,
  }: PostQueryParams) => {
    const response = await axios.get('/api/getpost', {
      params: {
        take,
        lastCursor,
        typePost,
        search,
      },
    });
    return response?.data;
  };

  const { data } = useQuery({
    queryFn: ({ pageParam = '' }) =>
      AllPost({
        take: 10,

        typePost: TypePost.POST,
      }),
    queryKey: ['posts'],
    select: (data: { data: PostData[] }) => {
      const tagsList: string[] = [];
      data.data.forEach((post) => {
        tagsList.push(...post.tags);
      });

      const uniqueArray = tagsList.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      return uniqueArray;
    },
  });

  useEffect(() => data && setTagList(data), [data]);

  return (
    <Card className="w-full p-5 ">
      <p className="font-semibold text-lg">Tags</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {tagList?.map((tag, id) => (
          <Button
            key={tag + id}
            onClick={() => dispatch(setSearch(tag))}
            size={'sm'}>
            {tag}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default ListTag;
