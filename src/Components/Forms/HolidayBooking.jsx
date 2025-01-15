import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const HolidayBooking = ({ holidays, setHolidays }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [holidayName, setHolidayName] = useState("");

  const handleAddHoliday = () => {
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (selectedDays.length === 0) {
      toast.error("Please select at least one day.");

      return;
    }

    const newHoliday = {
      dates: selectedDays,
      name: holidayName,
    };

    setHolidays([...holidays, newHoliday]);
    setShowModal(false);
    setSelectedDays([]);
    setHolidayName("");
  };

  const handleDayClick = (date) => {
    if (!selectedDays.some((d) => d.getTime() === date.getTime())) {
      setSelectedDays([...selectedDays, date]);
    }
  };

  const removeDate = (date) => {
    setSelectedDays(selectedDays.filter((d) => d.getTime() !== date.getTime()));
  };

  const deleteHoliday = (index) => {
    const updatedHolidays = [...holidays];
    updatedHolidays.splice(index, 1);
    setHolidays(updatedHolidays);
  };

  return (
    <div className="  tw-mx-auto tw-w-full tw-space-y-4">
      <button
        className="btn-save tw-text-white tw-py-2 tw-mt-2 tw-px-4 tw-rounded "
        onClick={handleAddHoliday}
      >
        Add Holiday
      </button>

      <ul className="tw-list-disc tw-space-y-2 tw-p-0">
        {holidays.map((holiday, index) => (
          <li
            key={index}
            className="tw-flex tw-items-center tw-justify-between tw-bg-gray-100 tw-px-4 tw-py-2 tw-rounded tw-border tw-border-gray-300"
          >
            <div>
              {holiday.dates
                .map((date) =>
                  date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                )
                .join(", ")}
              {holiday.name && <span>: {holiday.name}</span>}
            </div>

            <FiX
              size={18}
              className="tw-text-red-500 tw-font-bold tw-flex tw-items-center tw-gap-2"
              onClick={() => deleteHoliday(index)}
            />
          </li>
        ))}
      </ul>

      {showModal && (
        <Modal
          show={true}
          onHide={() => setShowModal(false)}
          centered
          className="tw-p-4"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <span className="tw-text-black">Add Holiday</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="tw-flex tw-flex-col tw-gap-4">
              <div>
                <label className="tw-block tw-mb-1 tw-text-gray-700">
                  Holiday Name (optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter holiday name"
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                  className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded"
                />
              </div>
              <div className="tw-flex tw-flex-col tw-items-center">
                <label className="tw-block tw-text-gray-700">
                  Select Dates
                </label>
                <DatePicker
                  inline
                  onSelect={handleDayClick}
                  highlightDates={selectedDays}
                  calendarClassName="tw-mt-2"
                />
              </div>
              <div>
                <label className="tw-block tw-text-gray-700 tw-font-bold tw-mb-2">
                  Selected Dates
                </label>
                <ul className="tw-list-none tw-p-0 tw-text-xs tw-flex tw-flex-wrap tw-gap-2">
                  {selectedDays.map((date, index) => (
                    <li
                      key={index}
                      className="tw-bg-gray-100 tw-px-3 tw-py-1 tw-rounded tw-flex tw-items-center tw-gap-2 tw-border tw-border-gray-300"
                    >
                      {date.toDateString()}
                      <FiX
                        size={15}
                        className="tw-text-red-500 tw-cursor-pointer"
                        onClick={() => removeDate(date)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="tw-flex tw-w-full tw-justify-between">
              <Button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-profile"
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSubmit} className="btn-save">
                Add
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default HolidayBooking;
