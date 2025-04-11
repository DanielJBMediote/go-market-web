import { IProductApi } from "@/api/ProductApi";

export function useStoreRevenue(products: IProductApi[]) {
  const { avarageSalles, totalOrdered, totalSalles } = products.reduce(
    (acc, prod) => {
      const totalOrdered = acc.totalOrdered + prod.timesOrdered;
      const avarageSalles =
        (acc.avarageSalles * acc.totalOrdered + prod.timesOrdered) / (acc.totalOrdered + 1);
      const totalSalles = acc.totalSalles + prod.price * prod.timesOrdered;

      return {
        totalOrdered,
        avarageSalles,
        totalSalles,
      };
    },
    {
      totalOrdered: 0,
      totalSalles: 0,
      avarageSalles: 0,
    }
  );

  return { avarageSalles, totalOrdered, totalSalles };
}
