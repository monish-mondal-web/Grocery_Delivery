import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

// functional component
const InputFild = ({ type, placeholder, name, handleChange, address }) => {
  return (
    <input
      className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-700 placeholder-gray-400 focus:border-primary transition"
      placeholder={placeholder}
      onChange={handleChange}
      name={name}
      value={address[name] || ""}
      type={type}
      required
    />
  );
};

const AddAddress = () => {
  const { axios, user, navigate } = useAppContext();

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    try {
      const { data } = await axios.post("/api/address/add", { address});
      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
    e.preventDefault();
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, []);

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler}>
            <div className="grid grid-cols-2 gap-4">
              <InputFild
                handleChange={handleChange}
                address={address}
                name="firstName"
                type="text"
                placeholder="First Name"
              />
              <InputFild
                handleChange={handleChange}
                address={address}
                name="lastName"
                type="text"
                placeholder="Last Name"
              />
            </div>
            <div className="mt-4">
              <InputFild
                name="email"
                placeholder="Email address"
                type="email"
                address={address}
                handleChange={handleChange}
              />
            </div>

            <div className="mt-4">
              <InputFild
                name="street"
                placeholder="Street"
                type="text"
                address={address}
                handleChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <InputFild
                name="city"
                placeholder="City"
                type="text"
                address={address}
                handleChange={handleChange}
              />
              <InputFild
                name="state"
                placeholder="State"
                type="text"
                address={address}
                handleChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <InputFild
                name="zipcode"
                placeholder="Zip code"
                type="text"
                address={address}
                handleChange={handleChange}
              />
              <InputFild
                name="country"
                placeholder="Country"
                type="text"
                address={address}
                handleChange={handleChange}
              />
            </div>

            <div className="mt-4">
              <InputFild
                name="phone"
                placeholder="Phone"
                type="tel"
                address={address}
                handleChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="mt-6 px-4 py-2 bg-primary text-white rounded"
            >
              Save Address
            </button>
          </form>
        </div>
        <div>
          <img
            className="md:mr-16 mb-16 md:mt-0 cursor-pointer"
            src={assets.add_address_iamge}
            alt="Add Address"
          />
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
