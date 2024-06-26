import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { selectUser } from '../../state/authSlice'
import { useGetJobsByCompanyQuery, useDeleteJobMutation } from '../../state/companyApiSlice'
import { MdWork, MdLocationOn, MdCheck, MdClear, MdEdit, MdDelete, MdOpenInNew } from 'react-icons/md'
import { RiMoneyDollarCircleFill } from 'react-icons/ri'

const CompanyProfile = () => {
  const user = useSelector(selectUser)

  const navigate = useNavigate()
  const [deleteJob] = useDeleteJobMutation() 

  const { data: jobs } = useGetJobsByCompanyQuery(user.id)

  const handleDelete = (id) => {
    deleteJob(id)
  }

  return (
    <>
      <h2 className="mt-5 ml-16 text-2xl font-medium">A te hirdetéseid:</h2>
      <div className="flex flex-col items-center">
        {jobs && jobs.map((job, i) => (
          <div key={i} className="bg-white shadow-lg w-[min(80rem,100%)] mt-10 flex justify-between">
            <div>
              <div className="text-4xl font-bold ml-10 mt-7">{job.position}</div>
              <div className="flex gap-3 ml-10 mt-2 mb-7 font-medium text-gray-500 wrapflex flex-wrap">
                <div className="flex gap-1"><MdWork size={25} /> {job.type === 'full-time' ? 'Teljes munkaidős' : (job.type === 'part-time' ? 'Részmunkaidős' : 'Gyakornok')}</div>
                <div className="flex gap-1"><MdLocationOn size={25} /> {job.city}</div>
                <div className="flex gap-1">{job.homeOffice ? <MdCheck size={25} /> : <MdClear size={25} />} Home Office</div>
                <div className="flex gap-1"><RiMoneyDollarCircleFill size={25} /> {job.salaryFrom / 1000}e - {job.salaryTo / 1000}e Ft</div>
              </div>
            </div>
            <div className="flex items-center wrapflex">
              <button onClick={() => navigate(`/job-details/${jobs[i].id}`)} className="btn btn-outline m-2">
                <MdOpenInNew size={25} /><span className="hide-items">Részletek</span>
              </button>
              <Link to={`/edit-job/${job.id}`} className="btn btn-outline m-2">
                <MdEdit size={25} /><span className="hide-items">Szerkesztés</span>
              </Link>
              <button onClick={() => handleDelete(job.id)} className="btn btn-outline m-2 mr-10 btn-error">
                <MdDelete size={25} /><span className="hide-items">Törlés</span>
              </button>
            </div>
          </div>
        ))}
        <Link to="/add-job" className="btn btn-primary my-10 w-72 text-xl">Hirdetés hozzáadása</Link>
      </div>
    </>
  )
}

export default CompanyProfile