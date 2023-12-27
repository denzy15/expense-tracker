import { Backdrop, IconButton, TableCell, TableRow } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { changeType } from "../store/reducers/extraSlice";
import { Transaction } from "../common/types";
import { Expense } from "../common/dataDTO/expenseDTO";
import { Income } from "../common/dataDTO/incomeDTO";
import UpdateTransactionForm from "./UpdateTransactionForm";
import { useState } from "react";
import { useAppDispatch } from "../store/hooks";

type Props = {
  transaction: Expense | Income;
  type: Transaction;
};

const TransactionItem = ({ type, transaction }: Props) => {
  const [openedModal, setOpenedModal] = useState(false);


  const dispatch = useAppDispatch();

  return (
    <>
      <TableRow sx={{ "& .MuiTableCell-body": { fontSize: 14 } }}>
        <TableCell>{transaction.category.name}</TableCell>
        <TableCell
          align="right"
          sx={{ color: type === "expense" ? "red" : "lightseagreen" }}
        >
          {type === "expense" ? "-" : "+"}
          {transaction.amount.toLocaleString()}₸
        </TableCell>
        <TableCell align="right">
          {new Date(transaction.date).toLocaleDateString()}
        </TableCell>
        <TableCell align="right">
          <IconButton
            onClick={() => {
              dispatch(changeType(type));
              setOpenedModal((prev) => !prev);
            }}
          >
            <EditIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      {openedModal && (
        <Backdrop open={openedModal} sx={{ zIndex: 2 }}>
          <UpdateTransactionForm
            transaction={transaction}
            close={() => setOpenedModal(false)}
          />
        </Backdrop>
      )}
    </>
  );
};

export default TransactionItem;
