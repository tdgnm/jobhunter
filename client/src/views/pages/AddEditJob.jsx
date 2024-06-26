import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAddJobMutation, useUpdateJobMutation, useGetJobQuery } from '../../state/companyApiSlice'

const AddEditJob = ({ edit }) => {
  const [data, setData] = useState({
    company: '',
    position: '',
    description: '',
    salaryFrom: '',
    salaryTo: '',
    type: '',
    city: '',
    homeOffice: false,
  })
  const [errors, setErrors] = useState({})

  const { id: jobId } = useParams()
  const { data: job } = useGetJobQuery(jobId, { skip: !jobId })
  const navigate = useNavigate()
  const [addJob] = useAddJobMutation()
  const [updateJob] = useUpdateJobMutation()

  useEffect(() => {
    if (job) {
      setData(job)
    }
  }, [job])

  const handleChange = (e) => {
    let value = e.target.value  
    if (e.target.name === 'homeOffice') {
      value = e.target.checked
    } else if (e.target.name === 'salaryFrom' || e.target.name === 'salaryTo') {
      value = parseInt(e.target.value) || ''
    }
    setData({
      ...data,
      [e.target.name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { company, position, salaryFrom, salaryTo, type, city } = data
    const newErrors = {}
    if (!company) {
      newErrors.company = 'A cégnév megadása kötelező!'
    }
    if (!position) {
      newErrors.position = 'A pozíció megadása kötelező!'
    }
    if (!salaryFrom || !salaryTo) {
      newErrors.salary = 'A fizetési sáv megadása kötelező!'
    } else if (salaryFrom > salaryTo) {
      newErrors.salary = 'A fizetési sáv megadása helytelen!'
    }
    if (!type) {
      newErrors.type = 'A típus megadása kötelező!'
    }
    if (!city) {
      newErrors.city = 'A település megadása kötelező!'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    try {
      const { id } = edit
        ? await updateJob({
            id: jobId,
            body: { ...data, homeOffice: !!data.homeOffice },
          }).unwrap()
        : await addJob({ ...data, homeOffice: !!data.homeOffice }).unwrap()

      navigate(`/job-details/${id}`)
    } catch (error) {
      newErrors.fail = 'Sikertelen mentés!'
      setErrors(newErrors)
    }
  }

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="w-[min(60rem,95%)]">
        <div className="grid grid-cols-2 mt-10 gap-8 wrapgrid">
          <div>
            <label htmlFor="company" className="form-control mb-2 text-xl font-medium text-gray-500">Cégnév</label>
            <input
              type="text"
              id="company"
              name="company"
              value={data.company}
              onChange={handleChange}
              className="input input-bordered w-full h-14 text-xl"
            />
            {errors.company && <span className="text-red-500 font-bold">{errors.company}</span>}
            <label htmlFor="type" className="form-control mt-5 mb-2 text-xl font-medium text-gray-500">Foglalkozás típusa</label>
            <select
              id="type"
              name="type"
              value={data.type}
              onChange={handleChange}
              className="select select-bordered w-full text-xl h-14"
            >
              <option value="" disabled></option>
              <option value="full-time">Teljes munkaidős</option>
              <option value="part-time">Részmunkaidős</option>
              <option value="internship">Gyakornok</option>
            </select>
            {errors.type && <span className="text-red-500 font-bold">{errors.type}</span>}
            <label htmlFor="city" className="form-control mt-5 mb-2 text-xl font-medium text-gray-500">Település</label>
            <input
                type="text"
                id="city"
                name="city"
                value={data.city}
                onChange={handleChange}
                className="input input-bordered w-full h-14 text-xl"
              />
            {errors.city && <span className="text-red-500 font-bold">{errors.city}</span>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="position" className="form-control mb-2 text-xl font-medium text-gray-500">Pozíció neve</label>
            <input
                type="text"
                id="position"
                name="position"
                value={data.position}
                onChange={handleChange}
                className="input input-bordered w-full h-14 text-xl"
              />
            {errors.position && <span className="text-red-500 font-bold">{errors.position}</span>}
            <label htmlFor="description" className="form-control mt-5 mb-2 text-xl font-medium text-gray-500">Leírás</label>
            <textarea
              id="description"
              name="description"
              value={data.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full flex-grow resize-none text-xl"
            >
            </textarea>
            {errors.description && <span className="text-red-500 font-bold mt-5 inline-block">{errors.description}</span>}
          </div>
          <div className="col-span-2 flex gap-5 w-full wrapflex">
            <div className="mt-9 flex gap-5 flex-grow">
              <input
                type="checkbox"
                id="homeOffice"
                name="homeOffice"
                checked={data.homeOffice}
                onChange={handleChange}
                className="checkbox checkbox-primary mt-1"
              />
              <label htmlFor="homeOffice" className="form-control mb-2 text-xl font-medium text-gray-500">Home Office lehetőség</label>
            </div>
            <div className="grid wrapgrid">
              <label htmlFor="salaryFrom" className="col-start-1 row-start-1 form-control mb-2 text-xl font-medium text-gray-500">Fizetési sáv alja</label>
              <input
                type="text"
                id="salaryFrom"
                name="salaryFrom"
                value={data.salaryFrom}
                onChange={handleChange}
                className="col-start-1 row-start-2 input input-bordered mr-5 h-14 text-xl"
              />
              <span className="col-start-2 row-start-2 text-xl font-medium text-gray-500 mt-3 divider2">-</span>
              <label htmlFor="salaryTo" className="col-start-3 row-start-1 form-control ml-5 mb-2 text-xl font-medium text-gray-500">Fizetési sáv teteje</label>
              <input
                type="text"
                id="salaryTo"
                name="salaryTo"
                value={data.salaryTo}
                onChange={handleChange}
                className="col-start-3 row-start-2 input input-bordered ml-5 h-14 text-xl"
              />
              {errors.salary && <span className="col-start-1 col-span-3 row-start-3 text-red-500 font-bold">{errors.salary}</span>}
            </div>
          </div>
        </div>
        {errors.fail && <span className="text-red-500 font-bold mt-5 inline-block">{errors.fail}</span>}
        <div className="flex justify-center">
          <button type="submit" className="btn btn-primary mt-5 w-72 text-xl">Mentés</button>
        </div>
      </form>
    </div>
  )
}

AddEditJob.propTypes = {
  edit: PropTypes.bool,
}

export default AddEditJob