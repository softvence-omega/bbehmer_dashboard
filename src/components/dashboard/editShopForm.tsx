import { useForm } from "react-hook-form";
import { useAdminUpdateCafeMutation } from "../../redux/features/admin/adminCoffeeManagement";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";

const EditShopForm = ({ shop, setEditingShop }: { shop: any; setEditingShop: any }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: shop.name || "",
      country: shop.country || "",
      state: shop.state || "",
      city: shop.city || "",
    },
  })

  const [adminUpdateCafe, { isLoading }] = useAdminUpdateCafeMutation()

  const onSubmit = async (values: any) => {

    try {
      const res = await adminUpdateCafe({ id: shop.id, data:{...values} }).unwrap()
      if(res.success){
        toast.success("Coffee Shope Details Updated")
        setEditingShop(false)
      }
    //   onClose(null)
    } catch (err) {
      console.error("Failed to update shop:", err)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input id="name" {...register("name", { required: true })} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="country" className="text-right">Country</Label>
        <Input id="country" {...register("country", { required: true })} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="state" className="text-right">State</Label>
        <Input id="state" {...register("state", { required: true })} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="city" className="text-right">City</Label>
        <Input id="city" {...register("city", { required: true })} className="col-span-3" />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  )
}


export default EditShopForm;