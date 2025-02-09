"use client";

import styles from "./DesertDrive.module.css";
import AssetCar from "./Car";
import { useEffect, useState } from "react";

interface BackgroundProps {
  carAnimationClass: string;
}

export default function Background({ carAnimationClass }: BackgroundProps) {
  const [cactusHeights, setCactusHeight] = useState<string[]>([]);

  useEffect(() => {
    const height = Math.floor(Math.random() * 50) + "px";
    setCactusHeight(
      Array.from({ length: 5 }, () => Math.floor(Math.random() * 100) + "px")
    );
  }, []);

  return (
    <div>
      <div className={styles.sky}>
        <div className={styles.cloud}></div>
        <div className={styles.cloud} style={{ animationDelay: "-15s" }}></div>
        <div className={styles.cloud} style={{ animationDelay: "-30s" }}></div>
      </div>
      <div className={styles.desert}>
        <div className={styles.cactusContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={styles.cactus}
              style={{
                bottom: cactusHeights[index],
                animationDelay: `${-index * 12}s`,
              }}
            ></div>
          ))}
        </div>
        <div className={styles.road}></div>
      </div>
      <div className={`${styles.car} ${carAnimationClass}`}>
        <AssetCar />
      </div>
    </div>
  );
}
