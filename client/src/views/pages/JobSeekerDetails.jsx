import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../state/authSlice'
import { useGetApplicationsForJobUserQuery, useGetExperiencesForUserQuery } from '../../state/userApiSlice'
import { useGetJobQuery } from '../../state/companyApiSlice'


const JobSeekerDetails = () => {
  const user = useSelector(selectUser)
  const navigate = useNavigate()
  const { jobId, userId } = useParams()
  const { data: job, error: err1 } = useGetJobQuery(jobId, { skip: !jobId })
  const { data: applicants, error: err2 } = useGetApplicationsForJobUserQuery({ jobId, userId }, { skip: !jobId || !userId })
  const [applicant, setApplicant] = useState(null)
  const { data: experiences } = useGetExperiencesForUserQuery(applicant?.id, { skip: !applicant })

  useEffect(() => {
    if (err1 || err2) {
      navigate('/', { replace: true })
    }
  }, [navigate, err1, err2])

  useEffect(() => {
    if (job && user.id != job.userId) {
      navigate('/', { replace: true })
    }
  }, [navigate, job, user])

  useEffect(() => {
    if (applicants) {
      const app = applicants[0]
      if (app) {
        setApplicant(app)
      } else {
        navigate('/', { replace: true })
      }
    }
  }, [navigate, userId, applicants])


  return (
    <div className="grid place-items-center grid-cols-1 w-full">
      <div className="relative bg-white shadow-lg w-[min(60rem,100%)] my-10 py-16">
        {applicant &&
          <>
            <table className="table zebra">
              <caption className="text-start pl-5 mb-5">
                <div className="text-xl font-bold">Személyes adatok</div>
              </caption>
              <tbody>
                <tr>
                  <th className="font-medium text-gray-500 w-[30%]">Név</th>
                  <td className="font-medium">{applicant.fullName}</td>
                </tr>
                <tr>
                  <th className="font-medium text-gray-500 w-[30%]">E-mail</th>
                  <td className="font-medium">{applicant.email}</td>
                </tr>
                <tr>
                  <th className="font-medium text-gray-500 w-[30%]">Státusz</th>
                  <td className="font-medium">Munkavállaló</td>
                </tr>
              </tbody>
            </table>
            <table className="table zebra">
              <caption className="text-start pl-5 mt-10 mb-5 text-xl font-bold">Korábbi tapasztalatok</caption>
              <tbody>
                {experiences && experiences.map((experience, i) => (
                  <tr key={i} className="relative">
                    <td className="font-medium text-gray-500 w-[30%]">{experience.company}</td>
                    <td className="font-medium w-[20%]">{experience.interval}</td>
                    <td className="font-medium">{experience.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        }
      </div>
    </div>
  )
}

export default JobSeekerDetails