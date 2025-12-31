export const validateEventBasicInfo = (values) => {
  const errors = {};

  if (!values.eventName?.trim()) {
    errors.eventName = "Event name is required";
  }

  if (!values.location) {
    errors.location = "Location is required";
  }

  if (!values.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!values.endDate) {
    errors.endDate = "End date is required";
  }

  if (
    values.startDate &&
    values.endDate &&
    values.endDate.isBefore(values.startDate)
  ) {
    errors.endDate = "End date must be after start date";
  }

  if (!values.capacity || values.capacity <= 0) {
    errors.capacity = "Capacity must be greater than 0";
  }

  if (!values.description?.trim()) {
    errors.description = "Description is required";
  }

  return errors;
};

export const isEventBasicInfoValid = (values) => {
  return Object.keys(validateEventBasicInfo(values)).length === 0;
};
