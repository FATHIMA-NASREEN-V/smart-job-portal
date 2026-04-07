import { useEffect, useState } from "react"
import { getAllUsers, deleteUser } from "../../../services/authService"

const UsersPage = () => {

  const [users, setUsers] = useState<any[]>([])

  const fetchUsers = async () => {
    const data = await getAllUsers()
    setUsers(data)
  }

  const handleDelete = async (id?: number) => {
    if (!id) {
      console.error("User ID missing")
      return
    }

    await deleteUser(id)
    fetchUsers()
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Username</th>
            <th className="p-3">Role</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-3">{u.username}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersPage