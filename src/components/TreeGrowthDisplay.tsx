'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import styles from './TreeGrowthDisplay.module.css';

interface TreeGrowthDisplayProps {
    waterCount: number;
}

const getTreeStage = (waterCount: number): number => {
    if (waterCount <= 5) return 1;
    if (waterCount <= 11) return 2;
    if (waterCount <= 17) return 3;
    if (waterCount <= 23) return 4;
    return 5; // 24–29
};

export default function TreeGrowthDisplay({ waterCount }: TreeGrowthDisplayProps) {
    const stage = useMemo(() => getTreeStage(waterCount), [waterCount]);

    const imageSrc = `/images/tree/tree_${stage}.png`;

    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <Image
                    key={stage} // forces re-render to trigger animation on stage change
                    src={imageSrc}
                    alt={`Tree growth stage ${stage}`}
                    fill
                    priority
                    className={styles.treeImage}
                />
            </div>
        </div>
    );
}
