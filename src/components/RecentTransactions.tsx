import { Expense } from "../common/dataDTO/expenseDTO";
import { Income } from "../common/dataDTO/incomeDTO";
import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TransactionItem from "./TransactionItem";
import { Transaction } from "../common/types";
import { sortTransactionsByDate } from "../common/utils";

type Props = {
  data: Expense[] | Income[];
  type: Transaction;
};

const RecentTransactions = ({ data, type }: Props) => {
  return (
    <Paper elevation={1} sx={{ bgcolor: "#fafafa", mt: 4 }}>
      <Typography variant="h5" sx={{ textAlign: "center", py: 2 }}>
        Последние транзакции:
      </Typography>
      <Divider />

      <Table>
        <TableHead>
          <TableRow
            sx={{ "& .MuiTableCell-head": { fontSize: 16, fontWeight: 500 } }}
          >
            <TableCell>Категория</TableCell>
            <TableCell align="right">Сумма</TableCell>
            <TableCell align="right">Дата</TableCell>
            <TableCell align="right">Редактирование</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortTransactionsByDate(data)
            .slice(0, 5)
            .map((transaction, i) => (
              <TransactionItem
                key={transaction.id + transaction.category.name}
                transaction={transaction}
                type={type}
              />
            ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default RecentTransactions;
