import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../state/authSlice'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetJobQuery } from '../../state/companyApiSlice'
import {
  useAddApplicationMutation,
  useDeleteApplicationMutation,
  useGetApplicationsForJobQuery,
} from '../../state/userApiSlice'
import { FaBuilding } from 'react-icons/fa6'
import { TbRectangleVerticalFilled } from 'react-icons/tb'

const JobDetails = () => {
  const user = useSelector(selectUser)

  const navigate = useNavigate()
  const { id } = useParams()
  const { data: job } = useGetJobQuery(id, { skip: !id })
  const applied = useGetApplicationsForJobQuery(id, { skip: !id }).data?.length && user?.role === 'jobSeeker'
  const { data: applicants } = useGetApplicationsForJobQuery(id, { skip: !id })
  const [addApplication] = useAddApplicationMutation()
  const [deleteApplication] = useDeleteApplicationMutation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (user && job && user.role === 'company' && job.userId === user.id) {
      setShow(true)
    }
  }, [user, job])

  const apply = async () => {
    if (applied) {
      await deleteApplication(id)
    } else {
      await addApplication({ jobId: +id })
    }
  }

  return (
    <div className="grid place-items-center grid-cols-1 w-full">
      <div className="relative bg-white shadow-lg w-[min(60rem,100%)] my-10 py-16">
        {user?.role === 'jobSeeker' &&
          <div className="absolute right-0 top-16 flex z-10">
            <button onClick={apply} className={`btn text-xl px-8 mr-5 ${applied ? 'btn-error' : 'btn-primary'}`}>
              {applied ? 'Visszavonás' : 'Jelentkezés'}
            </button>
          </div>
        }
        {job &&
          <table className="table zebra">
            <caption className="text-start pl-5 mb-5">
              <div className="text-xl font-bold flex align-bottom">
                <FaBuilding size={30} className="mr-6" />
                <TbRectangleVerticalFilled size={30} className="absolute top-[12px] left-[29.5px] text-white" />
                <FaBuilding size={30} className="absolute top-4 left-8" />
                {job.company}
              </div>
              <div className="font-medium text-gray-500 ml-14">cég állásajánlata</div>
            </caption>
            <tbody>
              <tr>
                <th className="font-medium text-gray-500 w-[30%]">Pozíció</th>
                <td className="font-medium">{job.position}</td>
              </tr>
              <tr>
                <th className="font-medium text-gray-500 w-[30%]">Típus</th>
                <td className="font-medium">{job.type === 'full-time' ? 'Teljes munkaidős' : (job.type === 'part-time' ? 'Részmunkaidős' : 'Gyakornok')}</td>
              </tr>
              <tr>
                <th className="font-medium text-gray-500 w-[30%]">Leírás</th>
                <td className="font-medium">{job.description}</td>
              </tr>
              <tr>
                <th className="font-medium text-gray-500 w-[30%]">Fizetési sáv</th>
                <td className="font-medium">Bruttó {job.salaryFrom / 1000}e - {job.salaryTo / 1000}e Ft</td>
              </tr>
              <tr>
                <th className="font-medium text-gray-500 w-[30%]">Település</th>
                <td className="font-medium">{job.city}</td>
              </tr>
              <tr>
                <th className="font-medium text-gray-500 w-[30%]">Home Office</th>
                <td className="font-medium">{job.homeOffice ? 'Van' : 'Nincs'}</td>
              </tr>
            </tbody>
          </table>
        }
        {show && (applicants?.length || '') &&
          <table className="table zebra">
            <caption className="text-start pl-5 mt-10 mb-5 text-xl font-bold">Jelentkezők</caption>
            <tbody>
              {applicants.map((applicant, i) => (
                <tr key={i} onClick={() => navigate(`/job/${job.id}/applicant/${applicant.id}`)} className="cursor-pointer">
                  <td className="font-medium text-gray-500 w-[30%]">{applicant.fullName}</td>
                  <td className="font-medium">{applicant.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  )
}

export default JobDetails