import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetFilteredJobsQuery } from '../../state/companyApiSlice'
import { MdSearch, MdFilterAlt, MdHomeWork } from 'react-icons/md'

const Home = () => {
  const [filterStr, setFilterStr] = useState('')
  const { data: jobs } = useGetFilteredJobsQuery(filterStr)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filter, setFilter] = useState({
    'position[$like]': '',
    'salaryFrom[$gte]': '',
    'salaryTo[$lte]': '',
    'type': '',
    'city': '',
    'homeOffice': 0,
  })

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen)
  }

  const handleChange = (e) => {
    const name = e.target.name
    let value = e.target.value
    if (name === 'position') {
      value = `%${e.target.value}%`
    } else if (name === 'homeOffice') {
      value = +e.target.checked
    }
    const newName = {
      position: 'position[$like]',
      salaryFrom: 'salaryFrom[$gte]',
      salaryTo: 'salaryTo[$lte]',
    }[name] || name
    
    setFilter({ ...filter, [newName]: value })
  }

  const handleSearch = () => {
    setFiltersOpen(false)

    const filterString = Object
      .keys(filter)
      .filter(key => filter[key])
      .map(key => `${key}=${filter[key]}`)
      .join('&')
    
    setFilterStr(filterString)
  }

  
  return (
    <div className="flex flex-col items-center mb-20">
      <div className="flex gap-5 w-[min(60rem,95%)] mt-16 relative">
        <input
          type="text"
          id="position"
          name="position"
          onChange={handleChange}
          className="input input-bordered w-full h-12 text-xl"
        />
        <button onClick={handleSearch} className="btn btn-primary text-xl">
          <MdSearch size={25} /> Keresés
        </button>
        <button onClick={toggleFilters} className={`btn btn-outline text-xl ${filtersOpen ? 'bg-neutral text-white' : ''}`}>
          <MdFilterAlt size={25} /> Szűrés
        </button>
        {filtersOpen &&
          <div className="absolute p-7 right-0 top-14 rounded-lg bg-white shadow-lg">
            <h2 className="text-3xl font-bold mb-5">Szűrők</h2>
            <div className="grid wrapgrid">
              <label htmlFor="salaryFrom" className="col-start-1 row-start-1 form-control mb-2 text-xl font-medium text-gray-500">Fizetés alsó határ</label>
              <input
                type="text"
                id="salaryFrom"
                name="salaryFrom"
                value={filter['salaryFrom[$gte]']}
                onChange={handleChange}
                className="col-start-1 row-start-2 input input-bordered mr-5 h-12 text-xl"
              />
              <span className="col-start-2 row-start-2 text-xl font-medium text-gray-500 mt-3 divider2">-</span>
              <label htmlFor="salaryTo" className="col-start-3 row-start-1 form-control ml-5 mb-2 text-xl font-medium text-gray-500">Fizetés felső határ</label>
              <input
                type="text"
                id="salaryTo"
                name="salaryTo"
                value={filter['salaryTo[$lte]']}
                onChange={handleChange}
                className="col-start-3 row-start-2 input input-bordered ml-5 h-12 text-xl"
              />
              <div className="mt-2 ml-12 flex gap-5 col-start-4 row-start-2">
                <input
                  type="checkbox"
                  id="homeOffice"
                  name="homeOffice"
                  checked={filter['homeOffice']}
                  onChange={handleChange}
                  className="checkbox checkbox-primary mt-1"
                />
                <label htmlFor="homeOffice" className="form-control mb-2 text-xl font-medium text-gray-500">Home Office lehetőség</label>
              </div>
            </div>
            <div className="grid wrapgrid mt-3">
              <label htmlFor="type" className="col-start-1 row-start-1 form-control mb-2 text-xl font-medium text-gray-500">Foglalkozás típusa</label>
              <select
                id="type"
                name="type"
                value={filter['type']}
                onChange={handleChange}
                className="col-start-1 row-start-2 select select-bordered w-full text-xl"
              >
                <option value=""></option>
                <option value="full-time">Teljes munkaidős</option>
                <option value="part-time">Részmunkaidős</option>
                <option value="internship">Gyakornok</option>
              </select>
              <label htmlFor="city" className="col-start-2 row-start-1 form-control ml-5 mb-2 text-xl font-medium text-gray-500">Település</label>
              <input
                type="text"
                id="city"
                name="city"
                value={filter['city']}
                onChange={handleChange}
                className="col-start-2 row-start-2 input input-bordered ml-5 h-12 text-xl"
              />
            </div>
          </div>
        }
      </div>
     <ul className="w-[min(60rem,95%)] mt-10">
      {jobs && jobs.map((job, i) => (
        <li key={i} className="border-b-[1px] first:border-t-[1px] border-gray-300 p-3">
          <Link to={`/job-details/${job.id}`} className="flex justify-between">
            <div>
              <div className="text-xl font-medium">{job.position} {(job.homeOffice || '') && <MdHomeWork size={20} className="inline ml-2" />}</div>
              <div className="font-medium text-gray-500">{job.city}</div>
            </div>
            <div className="text-end">
              <div className="text-xl font-medium">{job.salaryFrom / 1000}k - {job.salaryTo / 1000}k Ft</div>
              <div className="font-medium text-gray-500">{job.type === 'full-time' ? 'Teljes munkaidős' : (job.type === 'part-time' ? 'Részmunkaidős' : 'Gyakornok')}</div>
            </div>
          </Link>
        </li>
      ))}
     </ul>
    </div>
  )
}

export default Home