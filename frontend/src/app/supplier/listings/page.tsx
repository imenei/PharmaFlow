// app/supplier/listings/page.tsx
import ListingUpload from "@/components/supplier/ListingUpload";

export default function ListingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Listings PDF</h1>
      <ListingUpload />
    </div>
  );
}
