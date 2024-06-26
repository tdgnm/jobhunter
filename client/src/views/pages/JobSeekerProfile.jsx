import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../state/authSlice'
import { useSelector } from 'react-redux'
import { selectUser } from '../../state/authSlice'
import { useDeleteMutation } from '../../state/authApiSlice'
import {
  useGetExperiencesQuery,
  useAddExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useGetApplicationsQuery,
} from '../../state/userApiSlice'
import { MdEdit, MdDelete, MdAdd, MdCheck } from 'react-icons/md'
import { AiOutlineUserDelete } from 'react-icons/ai'

const JobSeekerProfile = () => {
  const user = useSelector(selectUser)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [deleteUser] = useDeleteMutation()
  const [addExperience] = useAddExperienceMutation()
  const [updateExperience] = useUpdateExperienceMutation()
  const [deleteExperience] = useDeleteExperienceMutation()

  const [editing, setEditing] = useState(false)
  const [currentEditing, setCurrentEditing] = useState(-1)
  const [input, setInput] = useState('')

  const { data: experiences } = useGetExperiencesQuery()
  const { data: applications } = useGetApplicationsQuery()

  const handleDelete = async () => {
    await deleteUser(user.id)

    dispatch(logout())
    navigate('/', { replace: true })
  }

  const handleEditing = () => {
    if (editing) {
      setCurrentEditing(-1)
      setInput('')
    }
    setEditing(!editing)
  }

  const handleCurrent = async (i) => {
    if (editing && currentEditing === i) {
      await handleSubmit(i)
      setCurrentEditing(-1)
    } else if (editing) {
      setCurrentEditing(i)
    }

    if (i < 0) {
      setInput('')
    } else {
      setInput(`${experiences[i].company};${experiences[i].title};${experiences[i].interval}`)
    }
  }

  const handleChange = (e) => {
    setInput(e.target.value)
  }

  const handleDeleteExperience = async (i) => {
    if (i < 0) {
      return
    }
    await deleteExperience(experiences[i].id)
  }

  const handleSubmit = async (i) => {
    if (!input || i === -1) {
      return
    }
    if (i === -2) {
      const experience = validateExperience(input)
      if (experience) {
        await addExperience(experience)
      }
      return
    }

    const id = experiences[i].id
    const experience = validateExperience(input)
    if (!experience) {
      return
    }
    await updateExperience({
      id,
      body: experience,
    })
  }

  const validateExperience = (experience) => {
    const splitExperience = experience.split(';').filter(data => data).map(data => data.trim())
    if (splitExperience.length!== 3) {
      return {}
    }

    const [company, title, interval] = splitExperience
    if (!/^\d{4}-(\d{4})?$/.test(interval)) {
      return {}
    } else {
      const [start, end] = interval.split('-').map(year => +year)
      const currentYear = new Date().getFullYear()
      if ((end && (start > end || end > currentYear))
        || (!end && start > currentYear)) {
        return {}
      }
    }
    return { company, title, interval }
  }

  return (
    <div className="grid place-items-center grid-cols-1 w-full">
      <div className="relative bg-white shadow-lg w-[min(60rem,100%)] my-10 pt-16">
        <div className="absolute right-0 top-16 flex z-10">
          <button onClick={handleEditing} className={`btn btn-outline mr-5 ${editing ? 'bg-neutral text-white' : ''}`}>
            <MdEdit size={25} />
            <span className="collapsible">Tapasztalatok szerkesztése</span>
          </button>
          <button onClick={handleDelete} className="btn btn-outline btn-error mr-5">
            <AiOutlineUserDelete size={25} />
            <span className="collapsible">Profil törlése</span>
          </button>
        </div>
        <table className="table zebra">
          <caption className="text-start pl-5 mb-5">
            <div className="text-xl font-bold">Személyes adatok</div>
            <div className="font-medium text-gray-500">Adataid és tapasztalataid egy helyen.</div>
          </caption>
          <tbody>
            <tr>
              <th className="font-medium text-gray-500 w-[30%]">Név</th>
              <td className="font-medium">{user.fullName}</td>
            </tr>
            <tr>
              <th className="font-medium text-gray-500 w-[30%]">E-mail</th>
              <td className="font-medium">{user.email}</td>
            </tr>
            <tr>
              <th className="font-medium text-gray-500 w-[30%]">Státusz</th>
              <td className="font-medium">{user.role === 'jobSeeker' ? 'Munkavállaló' : 'Munkáltató'}</td>
            </tr>
          </tbody>
        </table>
        {(applications?.length || '') &&
          <table className="table zebra">
            <caption className="text-start pl-5 mt-10 mb-5 text-xl font-bold">Jelentkezések</caption>
            <tbody>
              {applications.map((application, i) => (
                <tr key={i} onClick={() => navigate(`/job-details/${application.id}`)} className="cursor-pointer">
                  <td className="font-medium text-gray-500 w-[30%]">{application.company}</td>
                  <td className="font-medium">{application.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
        <table className="table zebra">
          <caption className="text-start pl-5 mt-10 mb-5 text-xl font-bold">Korábbi tapasztalatok</caption>
          <tbody>
            {experiences && experiences.map((experience, i) => (
              <tr key={i} className="relative">
                <td className="font-medium text-gray-500 w-[30%]">{!editing || currentEditing !== i ? experience.company : 'E'}</td>
                <td className="font-medium w-[20%]">{!editing || currentEditing !== i ? experience.interval : ''}</td>
                <td className="font-medium">{!editing || currentEditing !== i ? experience.title : ''}</td>
                <td className="w-0">
                  {editing && currentEditing === i &&
                    <input
                      type="text"
                      id={i}
                      name={i}
                      value={input}
                      placeholder="munkahely; pozíció; tól-ig (év)"
                      onChange={handleChange}
                      className="absolute top-0 left-0 h-7 m-2 px-3 w-[calc(100%-8rem)] font-medium border-[1px] border-neutral rounded-lg"
                    />
                  }
                  {editing &&
                    <div className="absolute right-0 top-0 h-2 flex z-10">
                      <button onClick={() => handleCurrent(i)} className="btn btn-outline btn-sm p-1 mt-2 mr-2">
                        {currentEditing === i ? <MdCheck size={20} /> : <MdEdit size={20} />}
                      </button>
                      <button onClick={() => handleDeleteExperience(i)} className="btn btn-outline btn-error btn-sm p-1 mt-2 mr-5">
                        <MdDelete size={20} />
                      </button>
                    </div>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="relative w-full h-16">
          {editing && currentEditing === -2 &&
            <input
              type="text"
              id="add"
              name="add"
              value={input}
              placeholder="munkahely; pozíció; tól-ig (év)"
              onChange={handleChange}
              className="absolute top-0 left-0 h-7 m-2 px-3 w-[calc(100%-8rem)] font-medium border-[1px] border-neutral rounded-lg"
            />
          }
          {editing && <div className="absolute top-0 right-0 z-10">
            <button onClick={() => handleCurrent(-2)} className="btn btn-outline btn-sm p-1 mt-2 mr-5">
              {currentEditing === -2 ? <MdCheck size={20} /> : <MdAdd size={20} />}
            </button>
          </div>}
        </div>
      </div>
    </div>
  )
}

export default JobSeekerProfile