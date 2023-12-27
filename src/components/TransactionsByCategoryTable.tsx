import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DetailedTranscationInfo from "./DetailedTranscationInfo";
import { Income } from "../common/dataDTO/incomeDTO";
import { Expense } from "../common/dataDTO/expenseDTO";
import { Transaction } from "../common/types";
import { sortTransactionsByDate } from "../common/utils";

type Props = {
  data: Income[] | Expense[];
  type: Transaction;
};

const TransactionsByCategoryTable = ({ data, type }: Props) => {
  return (
    <>
      <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        Транзакции
      </Typography>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              "& .MuiTableCell-head": { fontSize: 16, fontWeight: 500 },
            }}
          >
            <TableCell>№</TableCell>
            <TableCell align="right">Описание</TableCell>
            <TableCell align="right">Сумма</TableCell>
            <TableCell align="right">Дата</TableCell>
            <TableCell align="right">Редактирование</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortTransactionsByDate(data).map((transaction, index) => (
            <DetailedTranscationInfo
              type={type}
              index={index + 1}
              transaction={transaction}
              key={index}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TransactionsByCategoryTable;
