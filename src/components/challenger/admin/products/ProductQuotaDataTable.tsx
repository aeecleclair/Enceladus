import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";

interface ProductQuotaDataTableProps {
  data: Array<{
    school_id: string;
    schoolName: string;
    quota: number;
    product_id: string;
  }>;
  productName: string;
  onEditQuota: (schoolId: string) => void;
  onDeleteQuota: (schoolId: string) => void;
}

export function ProductQuotaDataTable({
  data,
  productName,
  onEditQuota,
  onDeleteQuota,
}: ProductQuotaDataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>École</TableHead>
            <TableHead>Quota</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((quota) => (
            <TableRow key={quota.school_id}>
              <TableCell className="font-medium">{quota.schoolName}</TableCell>
              <TableCell>
                <Badge variant="outline" className="gap-1">
                  {quota.quota} produit(s)
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditQuota(quota.school_id)}
                    className="gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteQuota(quota.school_id)}
                    className="gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Supprimer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
