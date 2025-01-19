import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectTimezones } from "store/slices/miscSlice";
import { useGetTimeZonesQuery } from "store/api/queries";
import Spinner from "Components/Shared/Spinner";

const TimezoneDropdown = ({ setSelectedTimezone, selectedTimezone }) => {
  const {
    refetch: reloadTimeZone,
    isLoading: isTimeZonesLoading,
    error,
  } = useGetTimeZonesQuery();
  useEffect(() => {
    reloadTimeZone();
  }, []);
  const storeTimeZones = useSelector(selectTimezones);

  const handleSelect = (event) => {
    setSelectedTimezone(event.target.value);
  };
  if (error) return <div> Failed to load timezones</div>;

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-start tw-gap-4 ">
      <label
        htmlFor="timezone-dropdown"
        className="tw-text-lg tw-font-semibold  tw-mr-auto tw-text-gray-700"
      >
        Select a Timezone
      </label>
      <div className="tw-relative tw-w-full tw-max-w-sm">
        {isTimeZonesLoading && !storeTimeZones ? (
          <Spinner />
        ) : (
          <select
            id="timezone-dropdown"
            className="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-text-gray-700 tw-bg-white tw-shadow-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
            value={selectedTimezone}
            onChange={handleSelect}
          >
            <option value="" disabled>
              -- Choose a timezone --
            </option>
            {storeTimeZones.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default TimezoneDropdown;
