// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="tw-flex tw-items-center tw-justify-center tw-h-screen tw-bg-gray-100 tw-text-gray-800">
      <div className="tw-text-center">
        <h1 className="tw-text-9xl tw-font-extrabold tw-text-gray-900">404</h1>
        <p className="tw-text-2xl md:tw-text-3xl tw-font-medium tw-mt-4">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          to="/"
          className="tw-mt-6 tw-inline-block tw-px-6 tw-py-3 tw-text-lg tw-text-white tw-bg-black hover:tw-bg-blue-700 tw-rounded-md tw-shadow-md tw-transition tw-duration-300"
        >
          Go back to the homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
