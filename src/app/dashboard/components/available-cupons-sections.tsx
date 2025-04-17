import { ICuponApi } from "@/api/CuponApi";
import { useCuponsQuery } from "@/hooks/cupons/queries";
import { motion, useAnimation } from "framer-motion";
import { Ticket } from "lucide-react";
import { useEffect } from "react";

function InfiniteCarousel({ cupons }: { cupons: ICuponApi[] }) {
  const controls = useAnimation();

  useEffect(() => {
    const loop = async () => {
      while (true) {
        await controls.start({
          x: "200%",
          transition: {
            duration: 35,
            ease: "linear",
          },
        });
        controls.set({ x: 0 });
      }
    };
    // loop();
  }, [controls]);

  const items = cupons.map((cupon, index) => (
    <div
      key={`${cupon.id}-${index}`}
      className="flex items-center gap-2 px-4 text-center bg-gradient-to-r from-red-500 to-orange-500 text-white py-1 rounded-sm shadow-lg"
    >
      <Ticket />
      <div className="flex flex-col gap-0.5 items-center">
        <span className="uppercase">{cupon.cuponCode}</span>
        <span className="relative text-xs font-bold">-{cupon.percentDiscount}% OFF</span>
      </div>
    </div>
  ));

  return (
    <motion.div className="flex gap-6 flex-nowrap o" animate={controls}>
      {[...items]}
    </motion.div>
  );
}

export function AvailableCuponsSections() {
  const { refetch, data: cupons } = useCuponsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (cupons.length == 0) {
    return null;
  }
  return (
    <div className="overflow-hidden w-full p-4">
      <InfiniteCarousel cupons={cupons} />
    </div>
  );
}
