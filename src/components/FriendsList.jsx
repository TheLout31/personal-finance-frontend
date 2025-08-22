import { useEffect, useState } from "react";
import axios from "axios";

const FriendsList = ({ token }) => {
  const [friends, setFriends] = useState([]);

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
                onClick={() => alert(`Transfer to ${friend.name}`)}
              >
                Transfer
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-400">No friends added yet.</p>
        )}
      </ul>
    </div>
  );
};

export default FriendsList;
