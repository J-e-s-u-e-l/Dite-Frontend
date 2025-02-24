"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import apiClient from "@/utils/apiClient";
import { useParams } from "next/navigation";
import Loader from "@/components/common/Loader";

interface Member {
  userId: string;
  username: string;
  roleName: string;
  assignedTracks?: string[];
}

const AcademyInfoPage = () => {
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [error, setError] = useState("");
  const { academyId } = useParams();
  const [members, setMembers] = useState<Member[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [academyCode, setAcademyCode] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [newRole, setNewRole] = useState("Member");
  const [assignedTracks, setAssignedTracks] = useState<string[]>([]);
  const [tracks, setTracks] = useState<
    { trackId: string; trackName: string }[]
  >([]);
  const { showToast } = useToast();

  const fetchAcademyInfo = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_URL}/Academies/${academyId}/academy-info`
      );
      const responseData = await response.data;
      if (responseData.status) {
        setAcademyCode(responseData.data.academyCode);
      } else {
        showToast(responseData.message, "error");
      }
    } catch (error) {
      showToast("Failed to fetch Academy Info page. Please try again", "error");
      setPageError("Failed to load Academy Info page. Please try again.");
      console.error("Error fetching academy info", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademyInfo();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_URL}/Academies/${academyId}/members`
      );

      const responseData = await response.data;
      if (responseData.status) {
        setMembers(responseData.data.members);
        setIsAdmin(responseData.data.isAnAdminInTheAcademy);
      } else {
        showToast(responseData.data.message, "error");
      }
    } catch (error) {
      showToast("Failed to fetch members. Please try again", "error");
      setPageError("Failed to load Academy Info page. Please try again.");
      console.error("Error fetching members", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [academyId]);

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `${process.env.NEXT_PUBLIC_API_URL}/Academies/${academyId}/tracks`
      );
      const responseData = await response.data;
      if (responseData.status) {
        setTracks(responseData.data);
      } else {
        showToast(responseData.message, "error");
      }
    } catch (error) {
      showToast("Failed to load Academy Info page. Please try again", "error");
      setPageError("Failed to load Academy Info page. Please try again.");
      console.error("Error fetching tracks", error);
    } finally {
      setLoading(false);
    }
  };
  // Nothing much
  // Nothing much
  useEffect(() => {
    if (academyId) {
      fetchTracks();
    }
  }, [academyId]);

  const toggleSelectedMember = (member) => {
    if (selectedMember?.userId === member.userId) {
      setSelectedMember(null);
    } else {
      setSelectedMember(member);
    }
  };

  const renderMoreOptionsModal = () => {
    if (!selectedMember) return null;

    return (
      <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded">
        <button
          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
          onClick={() => {
            setRoleModalOpen(true);
            setNewRole(selectedMember.roleName);
            setAssignedTracks(selectedMember.assignedTracks || []);
          }}
        >
          Change Role
        </button>
        <button
          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-200"
          onClick={() => setRemoveModalOpen(true)}
        >
          Remove User
        </button>
      </div>
    );
  };

  // Add new empty track selection
  // const addTrack = () => setAssignedTracks([...assignedTracks, ""]);
  const addTrack = () => {
    if (assignedTracks.length >= tracks.length) {
      showToast("All available tracks are already assigned", "info");
      return;
    }
    setAssignedTracks([...assignedTracks, ""]);
  };

  // Remove a track from selection
  const removeTrack = (index: number) =>
    setAssignedTracks(assignedTracks.filter((_, i) => i !== index));

  // Update a specific track selection
  const updateTracks = (index: number, value: string) => {
    if (assignedTracks.includes(value)) {
      showToast("This track is already selected.", "error");
      return;
    }
    setAssignedTracks(
      assignedTracks.map((track, i) => (i === index ? value : track))
    );
  };

  // Validate form before submission
  const validateChangeRoleForm = () => {
    // if (newRole === "Facilitator" && assignedTracks.some((track) => !track)) {
    if (
      newRole === "Facilitator" &&
      (assignedTracks.length === 0 || assignedTracks.some((track) => !track))
    ) {
      showToast(
        "Please select at valid track for the Facilitator role.",
        "info"
      );
      return false;
    }
    setError("");
    return true;
  };

  const handleRemoveUser = async () => {
    if (!selectedMember) return;

    setLoading(true);
    try {
      const payload: any = {
        memberId: selectedMember.userId,
        academyId,
      };

      const response = await apiClient.put(
        // `${process.env.NEXT_PUBLIC_API_URL}/Academies/${academyId}/members/${selectedMember.userId}`
        `${process.env.NEXT_PUBLIC_API_URL}/Academies/members/remove-member`,
        payload
      );

      const data = await response.data;
      if (data.status) {
        showToast(data.message, "success");
        setMembers((prev) =>
          prev.filter((member) => member.userId !== selectedMember.userId)
        );
        handleReload();
        setSelectedMember(null);
        setRemoveModalOpen(false);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Failed to remove user. Please try again", "error");
      console.error("Error removing members", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async () => {
    if (!selectedMember) return;
    if (!validateChangeRoleForm()) return;

    setLoading(true);
    try {
      const payload: any = {
        memberId: selectedMember.userId,
        newRole,
        academyId,
      };

      if (newRole === "Facilitator") {
        payload.assignedTracksIds = assignedTracks; // Include tracks only for Facilitators
      }

      const response = await apiClient.put(
        // `${process.env.NEXT_PUBLIC_API_URL}/Academies/${academyId}/members/${selectedMember.userId}`,
        `${process.env.NEXT_PUBLIC_API_URL}/Academies/members/change-role`,
        payload
      );

      const data = await response.data;
      if (data.status) {
        showToast(data.message, "success");
        setMembers((prev) =>
          prev.map((member) =>
            member.userId === selectedMember.userId
              ? { ...member, role: newRole, assignedTracks }
              : member
          )
        );
        handleReload();
        setSelectedMember(null);
        setRoleModalOpen(false);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Failed to update role. Please try again.", "error");
      console.error("Failed to update role.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    setPageError("");
    fetchAcademyInfo();
    fetchMembers();
    fetchTracks();
  };

  if (loading) {
    return <Loader />;
  }

  if (pageError) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{pageError}</p>
        <button
          onClick={handleReload}
          className="mt-4 p-2 rounded bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Academy Members
        </h1>
        <p>Academy Code: {academyCode ?? ""}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        {members.map((member) => (
          <div
            key={member.userId}
            className="flex justify-between items-center border-b pb-3 mb-3"
          >
            <div>
              <h3 className="text-lg font-medium">{member.username}</h3>
              <p className="text-sm text-gray-500">{member.roleName}</p>
            </div>
            {isAdmin && (
              <div className="relative">
                <button
                  className="text-gray-600 hover:text-gray-800"
                  // onClick={() => setSelectedMember(member)}
                  onClick={() => toggleSelectedMember(member)}
                >
                  ⋮
                </button>
                {selectedMember?.userId === member.userId &&
                  renderMoreOptionsModal()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Role Change Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Change Role</h2>
            <div className="mb-4">
              <label className="block mb-2">Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Admin">Admin</option>
                <option value="Facilitator">Facilitator</option>
                <option value="Member">Member</option>
              </select>
            </div>

            {/* Facilitator track assignment dropdown  */}
            {newRole === "Facilitator" && (
              <div>
                <label className="block mb-2">Assigned Tracks</label>
                {assignedTracks.map((trackId, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <select
                      value={trackId}
                      onChange={(e) => updateTracks(index, e.target.value)}
                      className="flex-grow p-2 border rounded mr-2"
                    >
                      <option value="">Select a track</option>
                      {tracks
                        .filter(
                          (track) =>
                            !assignedTracks.includes(track.trackId) ||
                            track.trackId == trackId
                        )
                        .map((track) => (
                          <option key={track.trackId} value={track.trackId}>
                            {track.trackName}
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={() => removeTrack(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addTrack}
                  className="text-blue-500 hover:text-blue-700"
                >
                  + Add Track
                </button>
              </div>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setRoleModalOpen(false)}
                className="px-4 py-2 mr-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeRole}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove User Modal */}
      {removeModalOpen && (
        <div className="fixed inset=0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Remove User</h2>
            <p className="mb-4">
              Are you sure you want to remove {selectedMember?.username} from
              the academy?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setRemoveModalOpen(false)}
                className="px-4 py-2 mr-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveUser}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademyInfoPage;
