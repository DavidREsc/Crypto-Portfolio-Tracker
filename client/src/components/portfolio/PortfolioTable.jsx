import React, {useEffect} from "react";
import {formatNumber, formatPercent, calculatePercentChange} from "../../utils/formatData";
import { VscTriangleDown } from "react-icons/vsc";
import { IoMdCloseCircle } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import { Link } from "react-router-dom";

const PortfolioTable = (props) => {
  const { curPortfolioAssets, showDeleteAssetForm, showTransactions } = props;
  return (
    <>
      <div className="asset-title-container">Your Assets</div>
      <div className="asset-table-container">
        <table className="asset-table">
          <thead>
            <tr>
              <th className="first-header">Name</th>
              <th>Price</th>
              <th className="d-change-header">24h</th>
              <th>Holdings</th>
              <th className="profit-loss-header">Profit/Loss</th>
              <th className="last-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {curPortfolioAssets &&
              curPortfolioAssets.map((asset, idx) => {
                // Format decimal places for profit/loss
                const profitLoss = formatNumber(
                  Math.abs(asset.profitLossUnf)
                );
                return (
                  <tr key={idx}>
                    {/* Asset name column */}
                    <td className="first-td">
                      <img
                        className="content-asset-img"
                        src={asset.iconUrl}
                        alt={asset.name}
                      ></img>
                      <Link className="coin-link" to={`/browse/${asset.uuid}`}>
                        {asset.name}
                      </Link>
                    </td>

                    {/* Current asset price column */}
                    <td>
                      {"$" + formatNumber(asset.price)}
                      <div
                        className="d-change-active"
                        style={
                          asset.change < 0
                            ? { color: "#f44336" }
                            : { color: "hsl(145, 100%, 36%)" }
                        }
                      >
                        <VscTriangleDown
                          style={
                            asset.change < 0
                              ? ""
                              : { transform: "rotate(180deg)" }
                          }
                        />
                        {Math.abs(asset.change).toFixed(2) + "%"}
                      </div>
                    </td>

                    {/* 1d percent change column */}
                    <td
                      className="d-change-col"
                      style={
                        asset.change < 0
                          ? { color: "#f44336" }
                          : { color: "hsl(145, 100%, 36%)" }
                      }
                    >
                      <VscTriangleDown
                        style={
                          asset.change < 0
                            ? ""
                            : { transform: "rotate(180deg)" }
                        }
                      />
                      {Math.abs(asset.change).toFixed(2) + "%"}
                    </td>

                    {/* Asset holdings (dollar amount and coin amount) */}
                    <td>
                      <div>
                        {"$" + formatNumber(asset.holdings)}
                        <p className="holdings">
                          {(
                            asset.asset_amount - (asset.amount_sold || 0)
                          ).toFixed(6) +
                            " " +
                            asset.symbol}
                        </p>
                      </div>
                    </td>

                    {/* Profit/loss columns */}
                    <td
                      className="profit-loss-col"
                      style={
                        asset.profitLossUnf < 0
                          ? { color: "#f44336" }
                          : { color: "hsl(145, 100%, 36%)" }
                      }
                    >
                      {(asset.profitLossUnf < 0 ? "-$" : "$") + profitLoss}
                      <div className="profit-loss">
                        <VscTriangleDown
                          style={
                            asset.profitLossUnf < 0
                              ? ""
                              : { transform: "rotate(180deg)" }
                          }
                        />
                        {(asset.profitLossPercent !== undefined
                          ? asset.profitLossPercent
                          : formatPercent(
                              Math.abs(
                                calculatePercentChange(
                                  asset.holdings,
                                  asset.initialHoldings
                                )
                              )
                            )) + "%"}
                      </div>
                    </td>

                    {/* Actions columns */}
                    <td className="last-td">
                      <div className="actions">
                        <button
                          className="edit-transaction"
                          onClick={() => showTransactions(asset)}
                        >
                          <IoIosAddCircle className="edit-transaction-icon" />
                        </button>
                        <button
                          className="delete-asset"
                          onClick={() => showDeleteAssetForm(asset)}
                        >
                          <IoMdCloseCircle className="delete-asset-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PortfolioTable;
