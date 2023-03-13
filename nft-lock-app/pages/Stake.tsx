import {
    ConnectWallet,
    ThirdwebNftMedia,
    useAddress,
    useContract,
    useContractRead,
    useContractWrite,
    useOwnedNFTs,
    useTokenBalance,
    Web3Button,
  } from "@thirdweb-dev/react";
  import { BigNumber, ethers } from "ethers";
  import type { NextPage } from "next";
  import { useEffect, useState } from "react";
  import NFTCard from "../components/NFTCard";
  import { NFT_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS} from "../const/Index";
  import styles from "../styles/Home.module.css";
  
  const Stake: NextPage = () => {
    
    const address = useAddress();
    const { contract: nftDropContract } = useContract(
      NFT_CONTRACT_ADDRESS,
      "nft-drop"
    );
    const { contract: tokenContract } = useContract(
      TOKEN_CONTRACT_ADDRESS,
      "token"
    );
    const { contract, isLoading } = useContract(STAKING_CONTRACT_ADDRESS, "custom");
    const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
    const { data: tokenBalance } = useTokenBalance(tokenContract, address);
    const { mutateAsync: claimRewards } = useContractWrite(
      contract,
      "claimRewards"
    );
    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
    const { data: stakedTokens } = useContractRead(
      contract,
      "getStakeInfo",
      address
    );
  
    useEffect(() => {
      if (!contract || !address) return;
  
      async function loadClaimableRewards() {
        const stakeInfo = await contract?.call("getStakeInfo", address);
        setClaimableRewards(stakeInfo[1]);
      }
  
      loadClaimableRewards();
    }, [address, contract]);

    console.log(ownedNfts)
  
    async function stakeNft(id: string) {
      if (!address) return;
  
      const isApproved = await nftDropContract?.isApproved(
        address,
        STAKING_CONTRACT_ADDRESS
      );
      if (!isApproved) {
        await nftDropContract?.setApprovalForAll(STAKING_CONTRACT_ADDRESS, true);
      }
      await contract?.call("stake", [id]);
    }
  
    if (isLoading) {
      return <div>Loading</div>;
    }
  
    return (
      <div className={styles.container}>
        <h1 className={styles.h1}>Stake Your NFTs</h1>
        <hr className={`${styles.divider} ${styles.spacerTop}`} />
  
        {!address ? (
          <ConnectWallet />
        ) : (
          <>
            <h2>Your Tokens</h2>
            <div className={styles.tokenGrid}>
              <div className={styles.tokenItem}>
                <h3 className={styles.tokenLabel}>Claimable Rewards</h3>
                <p className={styles.tokenValue}>
                  <b>
                    {!claimableRewards
                      ? "Loading..."
                      : ethers.utils.formatUnits(claimableRewards, 18)}
                  </b>{" "}
                  {tokenBalance?.symbol}
                </p>
              </div>
              <div className={styles.tokenItem}>
                <h3 className={styles.tokenLabel}>Current Balance</h3>
                <p className={styles.tokenValue}>
                  <b>{tokenBalance?.displayValue}</b> {tokenBalance?.symbol}
                </p>
              </div>
            </div>
  
            <Web3Button
              contractAddress={STAKING_CONTRACT_ADDRESS}
              action={(contract) => contract.call("claimRewards")}
            >
              Claim Rewards
            </Web3Button>
  
            <hr className={`${styles.divider} ${styles.spacerTop}`} />
            <h2>Your Staked NFTs</h2>
            <div className={styles.nftBoxGrid}>
              {stakedTokens &&
                stakedTokens[0]?.map((stakedToken: BigNumber) => (
                  <NFTCard
                    tokenId={stakedToken.toNumber()}
                    key={stakedToken.toString()}
                  />
                ))}
            </div>
  
            <hr className={`${styles.divider} ${styles.spacerTop}`} />
            <h2>Your Unstaked NFTs</h2>
            <div className={styles.nftBoxGrid}>
              {ownedNfts?.map((nft) => (
                  <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                  <ThirdwebNftMedia
                    metadata={nft.metadata}
                    className={styles.nftMedia}
                    />
                  <h3>{nft.metadata.name}</h3>
                  <Web3Button
                    contractAddress={STAKING_CONTRACT_ADDRESS}
                    action={() => stakeNft(nft.metadata.id)}
                    >
                    Stake
                  </Web3Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };
  
  export default Stake;