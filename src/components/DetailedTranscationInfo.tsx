import { Backdrop, IconButton, TableCell, TableRow } from "@mui/material";
import { Expense } from "../common/dataDTO/expenseDTO";
import { Income } from "../common/dataDTO/incomeDTO";
import EditIcon from "@mui/icons-material/Edit";
import { Transaction } from "../common/types";
import { changeType } from "../store/reducers/extraSlice";
import UpdateTransactionForm from "./UpdateTransactionForm";
import { useState } from "react";
import { useAppDispatch } from "../store/hooks";

type Props = {
  index: number;
  transaction: Expense | Income;
  type: Transaction;
};

const DetailedTranscationInfo = ({ index, transaction, type }: Props) => {
  const [openedModal, setOpenedModal] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <>
      <TableRow sx={{ "& .MuiTableCell-body": { fontSize: 15 } }}>
        <TableCell>{index}</TableCell>
        <TableCell align="right">{transaction.description}</TableCell>
        <TableCell
          align="right"
          sx={{ color: type === "expense" ? "red" : "lightseagreen" }}
        >
          {type === "expense" ? "-" : "+"} {transaction.amount.toLocaleString()}
          ₸
        </TableCell>
        <TableCell align="right">
          {new Date(transaction.date).toLocaleDateString()}
        </TableCell>
        <TableCell align="right">
          <IconButton
            onClick={() => {
              dispatch(changeType(type));
              setOpenedModal(true);
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

export default DetailedTranscationInfo;
