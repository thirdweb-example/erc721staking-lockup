# Lock NFT Staking App

## Introduction

This example demonstrates a use of several thirdweb tools to create an NFT Staking application that allows you to stake your NFT for an entire month and earn staking rewards. It combines:

- [NFT Drop contract](https://thirdweb.com/thirdweb.eth/DropERC721): To create a collection of NFTs that users can stake.
- [Token contract](https://thirdweb.com/thirdweb.eth/TokenERC20): To create a token that users can earn as a reward for staking.
- [NFT Lock contract](https://thirdweb.com/0xabbask.eth/NFTLock): To create a contract that users can stake their NFTs in, and earn tokens as a reward.

## Using This Template

Create a project using this example:

```bash
npx thirdweb create --template erc721staking-lockup
```

- Create an [NFT Drop](https://thirdweb.com/thirdweb.eth/DropERC721) contract using the dashboard.
- Create a [Token](https://thirdweb.com/thirdweb.eth/TokenERC20) contract using the dashboard.
- Create an [NFT Staking](https://thirdweb.com/0xabbask.eth/NFTLock) contract using the dashboard.
- Approve the NFT Staking contract to transfer your tokens.
- Deposit the tokens into the NFT Staking contract.
- Update the contract addresses in the [Index.ts](./const/Index.ts) file.
- Configure your network

Inside `_app.tsx` you can configure the network you want to use:

```jsx
import { Mumbai } from "@thirdweb-dev/chains";
```

Pass the chain inside the ThirdwebProvider

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).