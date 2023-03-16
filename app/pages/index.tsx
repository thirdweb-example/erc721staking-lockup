import { useRouter } from "next/router";
import Image from "next/image";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      {/* Top Section */}
      <h1 className={styles.h1}>thirdweb Staking Application</h1>
      <div className={styles.nftBoxGrid}>
        <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => router.push(`/Mint`)}
        >
          {/* Mint a new NFT */}
          <Image src="/icons/drop.png" alt="drop" width={50} height={64} />
          <h2 className={styles.selectBoxTitle}>Mint a new NFT</h2>
          <p className={styles.selectBoxDescription}>
            Use the NFT Drop Contract to claim an NFT from the collection.
          </p>
        </div>

        <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => router.push(`/Stake`)}
        >
          {/* Staking an NFT */}
          <Image src="/icons/lock.png" alt="token" width={64} height={64} />
          <h2 className={styles.selectBoxTitle}>Stake Your NFTs</h2>
          <p className={styles.selectBoxDescription}>
            Use the new thirdweb staking contract to stake and lock your NFTs and earn rewards for an entire month
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
