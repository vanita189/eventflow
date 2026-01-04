// import { Paper, Stack, Typography, Box, Tab, Tabs, TextField } from "@mui/material";
// import Editor from "../../components/Editor";
// import { useState, useEffect } from "react";
// import PrimaryButton from "../../components/PrimaryButton";
// import { useDispatch } from "react-redux";
// import { showSnackbar } from "../../redux/snackbar/snackbarSlice";
// import { useNavigate } from "react-router-dom";

// const ENTRY_TYPES = [
//   "Free Entry",
//   "Cover Entry",
//   "Ladies Entry",
//   "Stag Entry",
//   "Couple Entry",
// ];

// function EventPackage({ packageDetails, setPackageDetails, setStep }) {
//   const dispatch = useDispatch();
// const navigate = useNavigate();

//   const [entryType, setEntryType] = useState(0);
//   const isFreeEntry = entryType === 0;

//   const [form, setForm] = useState({
//     packageName: ENTRY_TYPES[0],
//     price: "",
//     allowedPersons: "",
//     quantity: "",
//     description: "",
//   });

//   const [errors, setErrors] = useState({});

//   /* Sync package name when tab changes */
//   useEffect(() => {
//     setForm((prev) => ({
//       ...prev,
//       packageName: ENTRY_TYPES[entryType],
//       price: entryType === 0 ? "" : prev.price,
//     }));
//   }, [entryType]);

//   const handleChange = (field) => (e) => {
//     setForm({ ...form, [field]: e.target.value });
//   };

//   const validatePackage = () => {
//     const newErrors = {};

//     if (!form.packageName) newErrors.packageName = "Package name is required";
//     if (!isFreeEntry && !form.price) newErrors.price = "Price is required";
//     if (!form.allowedPersons) newErrors.allowedPersons = "Allowed persons required";
//     if (!form.quantity) newErrors.quantity = "Quantity is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   return (
//     <Stack spacing={4}>
//       {/* Entry Type */}
//       <Box>
//         <Typography fontWeight={600}>Entry Type</Typography>
//         <Tabs
//           value={entryType}
//           onChange={(e, val) => setEntryType(val)}
//           variant="fullWidth"
//           sx={{ borderBottom: "1px solid #ccc" }}
//         >
//           {ENTRY_TYPES.map((type) => (
//             <Tab key={type} label={type} sx={{ fontWeight: 600 }} />
//           ))}
//         </Tabs>
//       </Box>

//       {/* Package Form */}
//       <Paper
//         sx={{
//           p: "24px 32px",
//           border: "0.5px solid #cfcbcbff",
//           borderRadius: 2,
//         }}
//       >
//         <Stack spacing={4}>
//           <Stack direction="row" spacing={4}>
//             <Box flex={1}>
//               <Typography fontWeight={600}>Package Name</Typography>
//               <TextField
//                 fullWidth
//                 value={form.packageName}
//                 disabled
//               />
//             </Box>

//             <Box flex={1}>
//               <Typography fontWeight={600}>Price (₹)</Typography>
//               <TextField
//                 fullWidth
//                 type="number"
//                 value={form.price}
//                 onChange={handleChange("price")}
//                 error={!!errors.price}
//                 helperText={errors.price}
//                 disabled={isFreeEntry}
//                 placeholder={isFreeEntry ? "Free Entry" : "Enter Amount"}
//               />
//             </Box>
//           </Stack>

//           <Stack direction="row" spacing={4}>
//             <Box flex={1}>
//               <Typography fontWeight={600}>Allowed Persons</Typography>
//               <TextField
//                 fullWidth
//                 type="number"
//                 value={form.allowedPersons}
//                 onChange={handleChange("allowedPersons")}
//                 error={!!errors.allowedPersons}
//                 helperText={errors.allowedPersons}
//                 placeholder="Eg: 1 / 2"
//               />
//             </Box>

//             <Box flex={1}>
//               <Typography fontWeight={600}>Total Quantity</Typography>
//               <TextField
//                 fullWidth
//                 type="number"
//                 value={form.quantity}
//                 onChange={handleChange("quantity")}
//                 error={!!errors.quantity}
//                 helperText={errors.quantity}
//                 placeholder="Eg: 100"
//               />
//             </Box>
//           </Stack>

//           <Box>
//             <Typography fontWeight={600}>Description</Typography>
//             <Editor
//               value={form.description}
//               onChange={(value) =>
//                 setForm((prev) => ({ ...prev, description: value }))
//               }
//             />
//           </Box>
//         </Stack>
//       </Paper>

//       {/* Actions */}
//       <Stack direction="row" justifyContent="space-between">
//         <PrimaryButton
//           onClick={() => setStep(0)}
//           sx={{ padding: "12px 50px" }}
//         >
//           Previous
//         </PrimaryButton>

//         <PrimaryButton
//           sx={{ padding: "12px 50px" }}
//           onClick={() => {
//             if (!validatePackage()) {
//               dispatch(
//                 showSnackbar({
//                   message: "Please fill all required package fields",
//                   severity: "warning",
//                 })
//               );
//               return;
//             }

//             setPackageDetails((prev) => [...prev, form]);

//             dispatch(
//               showSnackbar({
//                 message: "Package added successfully",
//                 severity: "success",
//               })
//             );
// navigate("/dashboardlayout/events");

//             /* Reset form */
//             setForm({
//               packageName: ENTRY_TYPES[entryType],
//               price: "",
//               allowedPersons: "",
//               quantity: "",
//               description: "",
//             });
//           }}
//         >
//           Add Entry Package
//         </PrimaryButton>
//       </Stack>
//     </Stack>
//   );
// }

// export default EventPackage;


// import {
//   Paper,
//   Stack,
//   Typography,
//   Box,
//   TextField,
//   MenuItem,
// } from "@mui/material";
// import Editor from "../../components/Editor";
// import { useState } from "react";
// import PrimaryButton from "../../components/PrimaryButton";

// const ENTRY_TYPES = [
//   "Free Entry",
//   "Cover Entry",
//   "Ladies Entry",
//   "Stag Entry",
//   "Couple Entry",
// ];

// const EMPTY_PACKAGE = {
//   price: "",
//   allowedPersons: "",
//   quantity: "",
//   description: "",
// };

// function EventPackage({ packageDetails, setPackageDetails, setStep }) {
//   const [selectedPackage, setSelectedPackage] = useState("");

//   const currentData =
//     packageDetails[selectedPackage] || EMPTY_PACKAGE;

//   const isFreeEntry = selectedPackage === "Free Entry";

//   const handleChange = (field) => (e) => {
//     setPackageDetails((prev) => ({
//       ...prev,
//       [selectedPackage]: {
//         ...prev[selectedPackage],
//         [field]: e.target.value,
//       },
//     }));
//   };

//   const handleEditorChange = (value) => {
//     setPackageDetails((prev) => ({
//       ...prev,
//       [selectedPackage]: {
//         ...prev[selectedPackage],
//         description: value,
//       },
//     }));
//   };

//   const handlePackageSelect = (e) => {
//     const pkg = e.target.value;
//     setSelectedPackage(pkg);

//     setPackageDetails((prev) => ({
//       ...prev,
//       [pkg]: prev[pkg] || EMPTY_PACKAGE,
//     }));
//   };

//   return (
//     <Stack spacing={4}>
//       {/* Dropdown */}
//       <Box>
//         <Typography fontWeight={600}>Select Entry Package</Typography>
//         <TextField
//           select
//           fullWidth
//           value={selectedPackage}
//           onChange={handlePackageSelect}
//         >
//           {ENTRY_TYPES.map((type) => (
//             <MenuItem key={type} value={type}>
//               {type}
//             </MenuItem>
//           ))}
//         </TextField>
//       </Box>

//       {/* Package Form */}
//       {selectedPackage && (
//         <Paper sx={{ p: 3, borderRadius: 2 }}>
//           <Stack spacing={3}>
//             <TextField
//               label="Package Name"
//               value={selectedPackage}
//               disabled
//             />

//             <TextField
//               label="Price"
//               type="number"
//               disabled={isFreeEntry}
//               value={currentData.price}
//               onChange={handleChange("price")}
//               placeholder={isFreeEntry ? "Free Entry" : ""}
//             />

//             <TextField
//               label="Allowed Persons"
//               type="number"
//               value={currentData.allowedPersons}
//               onChange={handleChange("allowedPersons")}
//             />

//             <TextField
//               label="Quantity"
//               type="number"
//               value={currentData.quantity}
//               onChange={handleChange("quantity")}
//             />

//             <Editor
//               value={currentData.description}
//               onChange={handleEditorChange}
//             />
//           </Stack>
//         </Paper>
//       )}

//       <PrimaryButton onClick={() => setStep(0)}>
//         Previous
//       </PrimaryButton>
//     </Stack>
//   );
// }

// export default EventPackage;
import {
  Paper,
  Stack,
  Typography,
  Box,
  TextField,
  MenuItem,
  Divider,
} from "@mui/material";
import Editor from "../../components/Editor";
import { useState } from "react";
import PrimaryButton from "../../components/PrimaryButton";

const ENTRY_TYPES = [
  "Free Entry",
  "Cover Entry",
  "Ladies Entry",
  "Stag Entry",
  "Couple Entry",
];

const EMPTY_FORM = {
  id: null,
  packageName: "",
  price: "",
  allowedPersons: "",
  quantity: "",
  description: "",
};

function EventPackage({ setStep }) {
  const [draftForm, setDraftForm] = useState(EMPTY_FORM);
  const [packages, setPackages] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const isFreeEntry = draftForm.packageName === "Free Entry";

  const usedPackageNames = packages.map((pkg) => pkg.packageName);

  /* Select package (NEW or EDIT if exists) */
  const handleSelectPackage = (e) => {
    const selected = e.target.value;

    const existingPackage = packages.find(
      (pkg) => pkg.packageName === selected
    );

    if (existingPackage) {
      // Edit existing package
      setDraftForm(existingPackage);
      setEditingId(existingPackage.id);
    } else {
      // New package
      setDraftForm({
        ...EMPTY_FORM,
        id: crypto.randomUUID(),
        packageName: selected,
      });
      setEditingId(null);
    }
  };

  /* Change fields */
  const handleChange = (field) => (e) => {
    setDraftForm({ ...draftForm, [field]: e.target.value });
  };

  /* Add / Update package */
  const handleAddPackage = () => {
    if (
      !draftForm.packageName ||
      !draftForm.allowedPersons ||
      !draftForm.quantity
    ) {
      alert("Please fill required fields");
      return;
    }

    if (editingId) {
      setPackages((prev) =>
        prev.map((pkg) =>
          pkg.id === editingId ? draftForm : pkg
        )
      );
    } else {
      setPackages((prev) => [draftForm, ...prev]);
    }

    setDraftForm(EMPTY_FORM);
    setEditingId(null);
  };

  /* Edit package */
  const handleEdit = (pkg) => {
    setDraftForm(pkg);
    setEditingId(pkg.id);
  };

  /* Remove package */
  const handleRemove = (id) => {
    setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
  };

  /* Submit all packages */
  const handleSubmitAll = () => {
    console.log("FINAL PAYLOAD 👉", packages);
    alert("All packages submitted!");
  };

  return (
    <Stack spacing={4}>
      {/* HEADER */}
      <Box>
        <Typography variant="h6" fontWeight={700}>
          Add Entry Packages
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add packages one by one. Each package type can be added only once.
        </Typography>
      </Box>

      {/* PACKAGE SELECT */}
      <Box>
        <TextField
          select
          fullWidth
          label="Entry Package Type"
          value={draftForm.packageName}
          onChange={handleSelectPackage}
          SelectProps={{ displayEmpty: true }}
        >
          <MenuItem value="" disabled>
            Select an entry package
          </MenuItem>

          {ENTRY_TYPES.map((type) => (
            <MenuItem
              key={type}
              value={type}
              disabled={usedPackageNames.includes(type)}
            >
              {type}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* FORM */}
      {draftForm.packageName && (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Stack spacing={3}>
            <Typography fontWeight={700}>
              {editingId ? "Edit Package" : "New Package"} –{" "}
              {draftForm.packageName}
            </Typography>

            <TextField
              label="Price"
              type="number"
              disabled={isFreeEntry}
              value={draftForm.price}
              onChange={handleChange("price")}
              placeholder={isFreeEntry ? "Free Entry" : ""}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Allowed Persons"
                type="number"
                value={draftForm.allowedPersons}
                onChange={handleChange("allowedPersons")}
              />
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={draftForm.quantity}
                onChange={handleChange("quantity")}
              />
            </Stack>

            <Editor
              value={draftForm.description}
              onChange={(v) =>
                setDraftForm({ ...draftForm, description: v })
              }
            />

            <PrimaryButton onClick={handleAddPackage}>
              {editingId ? "Update Package" : "Add Package"}
            </PrimaryButton>
          </Stack>
        </Paper>
      )}

      {/* ADDED PACKAGES LIST */}
      {packages.length > 0 && (
        <Stack spacing={2}>
          <Typography fontWeight={700}>Added Packages</Typography>

          {packages.map((pkg) => (
            <Paper key={pkg.id} sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Typography fontWeight={600}>
                  {pkg.packageName}
                </Typography>

                <Typography variant="body2">
                  Price:{" "}
                  {pkg.packageName === "Free Entry"
                    ? "Free"
                    : `₹${pkg.price}`}
                </Typography>

                <Typography variant="body2">
                  Persons: {pkg.allowedPersons} | Qty: {pkg.quantity}
                </Typography>

                <Stack direction="row" spacing={2}>
                  <PrimaryButton onClick={() => handleEdit(pkg)}>
                    Edit
                  </PrimaryButton>
                  <PrimaryButton onClick={() => handleRemove(pkg.id)}>
                    Remove
                  </PrimaryButton>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <Divider />

      {/* FOOTER */}
      <Stack direction="row" justifyContent="space-between">
        <PrimaryButton onClick={() => setStep(0)}>
          Previous
        </PrimaryButton>

        <PrimaryButton
          disabled={packages.length === 0}
          onClick={handleSubmitAll}
        >
          Submit Event
        </PrimaryButton>
      </Stack>
    </Stack>
  );
}

export default EventPackage;
