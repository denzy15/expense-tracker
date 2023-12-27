import { Backdrop, Box, Paper, Typography } from "@mui/material";
import { Saving } from "../common/dataDTO/savingDTO";
import { useState } from "react";
import UpdateSavingForm from "./UpdateSavingForm";

type Props = {
  saving: Saving;
};

const SavingItem = ({ saving }: Props) => {
  const [sukamodalopen, suka] = useState<boolean>(false);

  return (
    <Box
      component={Paper}
      alignItems={"center"}
      elevation={5}
      sx={{
        
        display: "flex",
        p: 2,
        gap: 2,
        bgcolor: "#e3f2fd",
        cursor: "pointer",
      }}
      onClick={() => suka(true)}
    >
      <Typography sx={{ fontSize: 16 }}>{saving.name}</Typography>
      <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
        {saving.amount.toLocaleString()} ₸
      </Typography>
      {sukamodalopen && (
        <Backdrop open={sukamodalopen} sx={{ zIndex: 2 }}>
          <UpdateSavingForm
            close={() => suka(false)}
            saving={saving}
            key={saving.id}
          />
        </Backdrop>
      )}
    </Box>
  );
};

export default SavingItem;
