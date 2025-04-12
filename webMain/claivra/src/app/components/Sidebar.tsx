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
import {
  LayoutDashboard,
  BookCheck,
  SquareStack,
  SquarePlus,
  UserCheck,
  Users,
} from "lucide-react";

const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  section?.scrollIntoView({ behavior: "smooth" });
};

const Sidebar = () => {
  return (
    <div className="bg-slate-950 text-slate-400 w-full ">
      <Command className="rounded-none bg-slate-950 text-slate-400">
        <CommandInput
          placeholder="Search"
          className="placeholder-slate-500 outline-none"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="text-gray-400">
            <CommandItem onSelect={() => scrollToSection("top")}>
              <LayoutDashboard className="mr-2" />
              Dashboard
            </CommandItem>

            <CommandItem onSelect={() => scrollToSection("user-management")}>
              <Users className="mr-2" />
              Manage User
            </CommandItem>

            <CommandItem onSelect={() => scrollToSection("admin-management")}>
              <UserCheck className="mr-2" />
              Manage Admin
            </CommandItem>

            <CommandItem onSelect={() => scrollToSection("verify-prediction")}>
              <BookCheck className="mr-2" />
              Verify Prediction
            </CommandItem>

            <CommandItem onSelect={() => scrollToSection("all-predictions")}>
              <SquareStack className="mr-2" />
              All Predictions
            </CommandItem>

            <CommandItem onSelect={() => scrollToSection("all-predictions")}>
              <SquarePlus className="mr-2" />
              Add Prediction
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default Sidebar;
