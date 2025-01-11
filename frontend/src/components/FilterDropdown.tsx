'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { HiAdjustmentsHorizontal } from 'react-icons/hi2';

interface FilterDropdownProps {
  onFilterApply: (filters: FilterState) => void;
}

export interface FilterState {
  dateRange: DateRange | undefined;
  searchQuery: string;
}

export function FilterDropdown({ onFilterApply }: FilterDropdownProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: undefined,
    searchQuery: '',
  });

  const handleDateSelect = (range: DateRange | undefined) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: range,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: e.target.value,
    }));
  };

  const handleApply = () => {
    onFilterApply(filters);
  };

  const handleReset = () => {
    setFilters({
      dateRange: undefined,
      searchQuery: '',
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <HiAdjustmentsHorizontal className="w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end" sideOffset={5}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Set the filters for the data you want to see.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid gap-2">
              <Label htmlFor="date">Date Range</Label>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !filters.dateRange && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange?.from ? (
                        filters.dateRange.to ? (
                          <>
                            {format(filters.dateRange.from, 'LLL dd, y')} -{' '}
                            {format(filters.dateRange.to, 'LLL dd, y')}
                          </>
                        ) : (
                          format(filters.dateRange.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    side="right"
                    sideOffset={0}
                  >
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={filters.dateRange?.from}
                      selected={filters.dateRange}
                      onSelect={handleDateSelect}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Enter search query"
                value={filters.searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
