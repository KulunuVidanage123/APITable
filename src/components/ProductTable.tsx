// src/components/ProductTable.tsx
interface ProductTableProps {
  products: any[]; 
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
  userRole: 'user' | 'admin' | 'manager'; 
}

export const ProductTable = ({ products, onEdit, onDelete, userRole }: ProductTableProps) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
          {userRole === 'admin' && (
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          )}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.map((product) => (
          <tr key={product.id}>
            <td className="px-4 py-2 whitespace-nowrap text-sm">{product.id}</td>
            <td className="px-4 py-2 whitespace-nowrap text-sm">{product.title}</td>
            <td className="px-4 py-2 whitespace-nowrap text-sm">${product.price.toFixed(2)}</td>
            <td className="px-4 py-2 whitespace-nowrap text-sm">{product.stock}</td>
            {userRole === 'admin' && (
              <td className="px-4 py-2 whitespace-nowrap text-sm">
                <button
                  onClick={() => onEdit(product)}
                  className="text-blue-600 hover:text-blue-900 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};