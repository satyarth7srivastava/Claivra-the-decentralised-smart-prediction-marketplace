import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import Link from "next/link";
import { LayoutDashboard , BookCheck , SquareStack, SquarePlus, UserCheck  ,Users } from 'lucide-react';


const Sidebar = () => {
  return (
    <div className="bg-slate-950 text-slate-400 w-full ">
      <Command className="rounded-none bg-slate-950 text-slate-400">
        <CommandInput placeholder="Search" className="placeholder-slate-500 outline-none" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="text-gray-400">
            <CommandItem><LayoutDashboard /><Link href="/admin/dashboard">Dashboard</Link></CommandItem>
            <CommandItem><BookCheck /><Link href="/admin/verify-prediction">Verify Prediction</Link></CommandItem>
            <CommandItem><SquareStack /><Link href="/admin/predictions">All Predictions</Link></CommandItem>
            <CommandItem><SquarePlus /><Link href="/admin/add-prediction">Add Prediction</Link></CommandItem>
            <CommandItem><UserCheck /><Link href="/admin/manage-admin">Manage Admin</Link></CommandItem>
            <CommandItem><Users /><Link href="/admin/manage-user">Manage User</Link></CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};


export default Sidebar;
