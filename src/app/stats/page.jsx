import { Button } from "@/components/ui/button"
import Link from 'next/link'
import {
  Card,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
export function Stats() {
  const timespans = [
    ["Today", "minutes"],
    ["This week", "hours"],
    ["This month", "hours"]
  ];

  return (
    <div className= 'flex flex-col gap-4 px-4 dark:bg-black dark:text-white'>
      {timespans.map((item, index) => {
        const title = item[0]; // e.g., "Today"
        const unit = item[1];   // e.g., "minutes"

        return ( 
          <div key={index}>
            <h1 className='p-2 text-2xl'>{title}</h1> {/* <- Now dynamic */}
            <Card className="dark:border-gray-800 max-w-full mx-2 p-4">
              <div className='flex flex-col [&>*]:my-1'>
                <div className='flex w-full justify-between'>
                  <span><Select>
  <SelectTrigger className="">
    <SelectValue placeholder="Unit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="seconds">Seconds</SelectItem>
    <SelectItem value="minutes">Minutes</SelectItem>
    <SelectItem value="hours">Hours</SelectItem>
  </SelectContent>

</Select></span>
                </div>
                <div className='h-[40%]  text-6xl'>
                  25:00
                </div>
                <div className='[&>*]:bg-custom [&>*]:rounded-full [&>*]:hover:cursor-pointer flex gap-2 flex-wrap [&>*]:text-sm [&>*]:px-1 '>
                  <span> geography </span>
                  <span> science </span>
                  <span> mathematics </span>
                  <span> english </span>
                  <span> general </span>
                </div>
              </div>
            </Card>
          </div>
        );
      })}
    <Link href='../categories'><Button variant='rounded' className='shadow-md bg-gray-200' >Practice</Button></Link>
    </div>
  );
}

export default Stats;
