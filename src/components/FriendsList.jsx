import { useEffect, useState } from "react";
import axios from "axios";

const FriendsList = ({ token }) => {
  const [friends, setFriends] = useState([]);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [formData, setFormData] = useState({
    type: "transfer",
    amount: "",
    description: "",
    toUser: "",
  });

  const openTransferModal = (friend) => {
    setSelectedFriend(friend);
    setFormData({
      type: "transfer",
      amount: "",
      description: "",
      toUser: friend._id,
    });
    setIsTransferModalOpen(true);
  };

  const closeModal = () => {
    setIsTransferModalOpen(false);
    setSelectedFriend(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  

  const fetchFriends = () => {
    let config = {
      method: "get",
      url: "http://localhost:3000/user/friends",
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .request(config)
      .then((response) => {
        setFriends(response.data.friendsList || []); // Ensure default []
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    console.log("Transfer Data:", formData);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/transaction/add-transaction",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(formData),
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data.message));
        closeModal()
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="rounded-2xl bg-neutral-900 p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Friends List</h2>
      <ul className="space-y-4">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <li
              key={friend._id}
              className="flex justify-between items-center border-b border-gray-800 pb-2"
            >
              <div>
                <span>{friend.name}</span>
                <p className="text-sm text-gray-400">{friend.email}</p>
              </div>

              <button
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                onClick={() => openTransferModal(friend)}
              >
                Transfer
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-400">No friends added yet.</p>
        )}
      </ul>
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              Transfer to {selectedFriend?.name}
            </h3>
            <form onSubmit={handleTransfer} className="space-y-4">
            
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
                required
              />
              {/* Hidden type & toUser */}
              <input type="hidden" name="type" value={formData.type} />
              <input type="hidden" name="toUser" value={formData.toUser} />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )} 
    </div>
  );
};

export default FriendsList;
