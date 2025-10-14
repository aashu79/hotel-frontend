import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  description: string;
}

const MenuManagementPage = () => {
  const [items, setItems] = useState<MenuItem[]>([
    {
      id: "ITEM001",
      name: "Butter Chicken",
      category: "Main Course",
      price: 320,
      image: "/butter-chicken.jpg",
      isVegetarian: false,
      isAvailable: true,
      description:
        "Tender chicken cooked in a creamy tomato sauce with butter and spices.",
    },
    {
      id: "ITEM002",
      name: "Paneer Tikka",
      category: "Starters",
      price: 250,
      image: "/paneer-tikka.jpg",
      isVegetarian: true,
      isAvailable: true,
      description: "Grilled cottage cheese marinated in yogurt and spices.",
    },
    {
      id: "ITEM003",
      name: "Veg Biryani",
      category: "Rice & Biryani",
      price: 280,
      image: "/veg-biryani.jpg",
      isVegetarian: true,
      isAvailable: true,
      description:
        "Fragrant rice cooked with mixed vegetables and aromatic spices.",
    },
    {
      id: "ITEM004",
      name: "Chicken Tikka",
      category: "Starters",
      price: 280,
      image: "/chicken-tikka.jpg",
      isVegetarian: false,
      isAvailable: true,
      description:
        "Tender pieces of chicken marinated in yogurt and spices, then grilled.",
    },
    {
      id: "ITEM005",
      name: "Gulab Jamun",
      category: "Desserts",
      price: 150,
      image: "/gulab-jamun.jpg",
      isVegetarian: true,
      isAvailable: false,
      description: "Deep-fried milk solids soaked in sugar syrup.",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    category: "",
    price: 0,
    image: "",
    isVegetarian: true,
    isAvailable: true,
    description: "",
  });

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addMenuItem = () => {
    const newId = `ITEM${(items.length + 1).toString().padStart(3, "0")}`;
    setItems([...items, { id: newId, ...newItem }]);
    setIsAddDialogOpen(false);
    setNewItem({
      name: "",
      category: "",
      price: 0,
      image: "",
      isVegetarian: true,
      isAvailable: true,
      description: "",
    });
  };

  const toggleAvailability = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const deleteMenuItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const categories = [
    "Starters",
    "Main Course",
    "Rice & Biryani",
    "Bread",
    "Desserts",
    "Beverages",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Menu Management
            </h1>
            <p className="text-slate-400 mt-1">
              Add, edit or remove menu items
            </p>
          </div>

          <Button
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="sm:max-w-[550px] bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-slate-100">
                  Add Menu Item
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  Enter the details of the new menu item.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      placeholder="Item name"
                      className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-slate-300">
                      Price (₹)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={newItem.price || ""}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          price: parseInt(e.target.value),
                        })
                      }
                      placeholder="0"
                      className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-slate-300">
                      Category
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setNewItem({ ...newItem, category: value })
                      }
                      value={newItem.category}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800">
                        {categories.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="text-slate-200 hover:bg-slate-800"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-slate-300">
                      Image URL
                    </Label>
                    <Input
                      id="image"
                      value={newItem.image}
                      onChange={(e) =>
                        setNewItem({ ...newItem, image: e.target.value })
                      }
                      placeholder="/image-url.jpg"
                      className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Type</Label>
                    <Select
                      onValueChange={(value) =>
                        setNewItem({
                          ...newItem,
                          isVegetarian: value === "vegetarian",
                        })
                      }
                      value={
                        newItem.isVegetarian ? "vegetarian" : "non-vegetarian"
                      }
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800">
                        <SelectItem
                          value="vegetarian"
                          className="text-slate-200 hover:bg-slate-800"
                        >
                          Vegetarian
                        </SelectItem>
                        <SelectItem
                          value="non-vegetarian"
                          className="text-slate-200 hover:bg-slate-800"
                        >
                          Non-vegetarian
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Availability</Label>
                    <Select
                      onValueChange={(value) =>
                        setNewItem({
                          ...newItem,
                          isAvailable: value === "available",
                        })
                      }
                      value={newItem.isAvailable ? "available" : "unavailable"}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800">
                        <SelectItem
                          value="available"
                          className="text-slate-200 hover:bg-slate-800"
                        >
                          Available
                        </SelectItem>
                        <SelectItem
                          value="unavailable"
                          className="text-slate-200 hover:bg-slate-800"
                        >
                          Unavailable
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                    placeholder="Describe the item..."
                    className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addMenuItem}
                  disabled={
                    !newItem.name || !newItem.category || newItem.price <= 0
                  }
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search menu items..."
              className="pl-10 bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="h-10 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-800/50">
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Category</TableHead>
                <TableHead className="text-slate-300">Type</TableHead>
                <TableHead className="text-slate-300">Price</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-right text-slate-300">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-slate-800 hover:bg-slate-800/30"
                  >
                    <TableCell className="font-medium text-slate-200">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {item.category}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.isVegetarian
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {item.isVegetarian ? "Veg" : "Non-veg"}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-200 font-medium">
                      ₹{item.price}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.isAvailable
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                        }`}
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAvailability(item.id)}
                          className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          {item.isAvailable
                            ? "Set unavailable"
                            : "Set available"}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-slate-800 text-slate-400"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-slate-900 border-slate-800"
                          >
                            <DropdownMenuLabel className="text-slate-200">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem className="text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-400 hover:bg-red-950/50 hover:text-red-300 cursor-pointer"
                              onClick={() => deleteMenuItem(item.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-slate-400"
                  >
                    No menu items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MenuManagementPage;
