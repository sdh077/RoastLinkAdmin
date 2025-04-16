'use client'
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, isBefore, isAfter, getDay } from "date-fns";
import { Label } from "@/components/ui/label";

const disabledDates = [new Date(2025, 1, 20), new Date(2025, 1, 22)]; // 출고 불가일
const allowedWeekdays = [1, 2, 3, 4]; // 월(1) ~ 목(4) 출고 가능
const today = new Date();
const maxDate = addDays(today, 14); // 2주 이내만 선택 가능

const isDateSelectable = (date: Date) => {
  return (
    !disabledDates.some((d) => d.toDateString() === date.toDateString()) &&
    allowedWeekdays.includes(getDay(date)) &&
    isBefore(date, maxDate) &&
    isAfter(date, today)
  );
};

const ShipmentDatePicker = ({ date, setDate }: { date: Date | null, setDate: React.Dispatch<React.SetStateAction<Date | null>> }) => {
  return (
    <div className="flex gap-8 items-center">
      <Label htmlFor="startDate">출고일 선택</Label>
      <DatePicker
        id="startDate"
        selected={date}
        onChange={(date) => setDate(date)}
        filterDate={isDateSelectable}
        minDate={today}
        maxDate={maxDate}
        dateFormat="yyyy-MM-dd"
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      />
    </div>
  );
};

export default ShipmentDatePicker;
