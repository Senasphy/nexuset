"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trophy, Clock, BookOpen, ArrowRight, Star } from 'lucide-react'

export function Stats() {
  const timespans = [
    { title: "Today", value: "25", unit: "min", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { title: "This Week", value: "12", unit: "hrs", color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
    { title: "This Month", value: "48", unit: "hrs", color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/30" }
  ];

  const categories = ["Geography", "Science", "Maths", "English", "General"];

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* --- Parent-Friendly Header --- */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Learning Progress
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Here is how your child is doing this month.
            </p>
          </div>
          <Link href='/categories'>
            <Button 
              className="rounded-full px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-200 dark:shadow-none transition-all hover:scale-105"
            >
              Start Practice <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </header>

        {/* --- Friendly Stats Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {timespans.map((item, index) => (
            <Card 
              key={index} 
              className="border-none shadow-sm bg-slate-50 dark:bg-zinc-900/50 rounded-[32px] p-8 space-y-6 transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-xs">
                  {item.title}
                </span>
                <div className={`p-2.5 rounded-2xl ${item.bg} ${item.color}`}>
                  <Clock size={20} />
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
                  {item.value}
                </span>
                <span className="text-xl font-bold text-slate-400">{item.unit}</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <Select defaultValue="minutes">
                    <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-none rounded-xl h-10 shadow-sm font-semibold text-slate-600 dark:text-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                      <SelectItem value="seconds">Seconds</SelectItem>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* --- Category Breakdown & Insights --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Category Chips Section */}
          <Card className="p-8 border-none bg-slate-50 dark:bg-zinc-900/50 rounded-[32px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 dark:bg-amber-950/40 p-2 rounded-xl text-amber-600">
                <BookOpen size={20} />
              </div>
              <h3 className="font-bold text-lg dark:text-white">Top Subjects</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <span 
                  key={cat} 
                  className="px-5 py-2.5 bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-bold shadow-sm border border-slate-100 dark:border-zinc-700 hover:border-blue-400 transition-all cursor-default"
                >
                  {cat}
                </span>
              ))}
            </div>
          </Card>

          {/* Achievement Insight */}
          <Card className="p-8 border-none bg-blue-600 rounded-[32px] text-white relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  Great Job! <Trophy size={24} className="text-amber-300 fill-amber-300" />
                </h3>
                <p className="text-blue-100 font-medium max-w-[280px]">
                  Your child is in the top 10% of learners in Science this week.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 font-bold text-sm bg-blue-500/50 w-fit px-4 py-2 rounded-full">
                <Star size={14} className="fill-current" /> Keep it up
              </div>
            </div>
            {/* Visual flair for parents */}
            <Trophy className="absolute -right-6 -bottom-6 w-40 h-40 opacity-10 group-hover:scale-110 transition-transform duration-700" />
          </Card>

        </div>
      </div>
    </div>
  )
}

export default Stats;
