'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import Loader from '@/components/Loader';
import { getAnalyticsOfTestimonialOverTime } from '@/lib/actions';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TestimonialCountData {
  date: string;
  count: number;
}

export default function TestimonialsCountChart() {
  const [testimonialData, setTestimonialData] = useState<
    TestimonialCountData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('all');

  console.log(testimonialData);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await getAnalyticsOfTestimonialOverTime();
      if (response?.status === 'success') {
        setTestimonialData(
          (response.data as TestimonialCountData[]).sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          ),
        );
      } else {
        toast.error('Error fetching analytics data');
        setError(
          'Failed to load testimonial count data. Please try again later.',
        );
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredData = testimonialData.filter((item) => {
    const date = new Date(item.date);
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case 'all':
        return true;
      case 'last-year':
        // Last year's data
        startDate.setFullYear(now.getFullYear() - 1);
        startDate.setMonth(0);
        startDate.setDate(1);
        const endDate = new Date(startDate);
        endDate.setFullYear(startDate.getFullYear() + 1);
        return date >= startDate && date < endDate;

      case 'this-year':
        // This year's data
        startDate.setMonth(0);
        startDate.setDate(1);
        return date >= startDate;

      case '90d':
        // Last 90 days
        startDate.setDate(now.getDate() - 90);
        return date >= startDate;

      case '7d':
        // Last 7 days
        startDate.setDate(now.getDate() - 7);
        return date >= startDate;

      default:
        return true;
    }
  });

  const chartConfig = {
    testimonials: {
      label: 'Testimonials',
      color: 'hsl(var(--chart-1))',
    },
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  console.log(filteredData);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Testimonials Over Time</CardTitle>
          <CardDescription>
            Number of testimonials received over time
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a time range"
          >
            <SelectValue placeholder="This Year" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="All" className="rounded-lg">
              All
            </SelectItem>
            <SelectItem value="this-year" className="rounded-lg">
              This Year
            </SelectItem>
            <SelectItem value="last-year" className="rounded-lg">
              Last Year
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Last 3 Months
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 Days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <Loader adjustHeight={true} isLoading={isLoading}>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[400px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient
                    id="fillTestimonials"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-testimonials)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-testimonials)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-testimonials)"
                  fillOpacity={1}
                  fill="url(#fillTestimonials)"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Loader>
    </Card>
  );
}
