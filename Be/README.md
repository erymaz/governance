# Barebones node JS Server

## Local environment
Install mongodb and create a database named `dao`.

## Running

```
yarn
yarn dev
```

## Pm2
```
pm2 start src/app.ts --watch
```

## Services
### lightApi
Returns token holders from proton main net.

### postgres
Returns SLOAN holders
* Please confirm the amount calculation here  :).

### sql
Returns short staked XPR holders

### schedule
We use a scheduler to calculate the user's voting power every 10 minutes.


## Strategies
Returns holders and total supply of governance tokens.
### loan-and-sloan-balances
Use LOAN and SLOAN for governance tokens

### xmt-balances
Use XMT for governance token

### xpr-unstaked-and-staked-balances
Use Unstaked XPR and short staked XPR for governance token


## V1
Endpoints version 1
