import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as csvParse from 'papaparse';
const _DATA_PATH = 'assets/data/_data.csv'




@Component({
  selector: 'app-students-map',
  templateUrl: './students-map.component.html',
  styleUrls: ['./students-map.component.scss']
})
export class StudentsMapComponent implements OnInit {

  isLoaded = false

  rawData = []
  filteredData = []
  
  defaultChartConfig ={
    chartType: 'GeoChart',
    columnNames: ["Provinces", 'Students'],
    options: {
      region: 'world',
      resolution: 'provinces',
      colorAxis: {colors: ['lightblue','red']},
      displayMode: 'regions',
    },
    dataList: []
  }

  dateSelectors = []
  locationSelectors = [
    'Canada',
    'All Provinces',
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Northwest Territories',
    'Nova Scotia',
    'Nunavut',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan',
    'Yukon',
  ]
  ageSelectors = []
  genderSelectors = []

  selectedFilters = {
    ref_date: '',
    location: 'Canada',
    age: '',
    gender: '',
  }

  constructor( private http: HttpClient ) {
    this.getCSVDataFile()
  }
  
  ngOnInit() {
  }


  //RETRIEVE DATA FROM CSV FILE
  getCSVDataFile = async () => (
    this.http.get(_DATA_PATH, {responseType: 'text'}).subscribe(csvData => this.csvToJson(csvData))
  )

  // CONVERT DATA TO JSON FOR EASIER MANIPULATION
  csvToJson = (csvData) => {  
    const fixedData = csvData.replace(/, /g, ' ').replace(/"/g, '')  
    
    csvParse.parse(fixedData, {
      header: true,
      delimiter: ",",
      skipEmptyLines: true,
      complete: (result) => {
        this.cleanData(result.data)
      }
    });
  }

  //CLEAN DATA FOR BETTER VISUALIZATION
  cleanData = (data) => {
    let allDates = []
    let allAges = []
    let allGenders = []
    this.rawData = data.map(data => {

      let tempAge = (data.Age === 'Total age') ? 'All ages' : data.Age
      let tempGender = (data.Sex === 'Total sex') ? 'All genders' : data.Sex
      
      if(!allDates.includes(data.REF_DATE)) allDates.push(data.REF_DATE)
      if(!allAges.includes(tempAge)) allAges.push(tempAge)
      if(!allGenders.includes(tempGender)) allGenders.push(tempGender)
      return {
        REF_DATE: data.REF_DATE,
        GEO: data.GEO,
        Age: tempAge,
        Gender: tempGender,
        VALUE: (data.VALUE) ? data.VALUE : 0,
      }
    })

    this.getDateFilters(allDates)
    this.getAgeFilters(allAges)
    this.getGenderFilters(allGenders)
    this.filterData(this.selectedFilters)  
  }

  // GET ALL FILTER OPTIONS FROM THE RAW DATA  
  getDateFilters = (allDates) => {
    this.dateSelectors = allDates.reverse()
    this.selectedFilters.ref_date = this.dateSelectors[0]
  }
  getAgeFilters = (allAges) => {
    this.ageSelectors = allAges
    this.selectedFilters.age = this.ageSelectors[0]
  }
  getGenderFilters = (allGenders) => {
    this.genderSelectors = allGenders
    this.selectedFilters.gender = this.genderSelectors[0]
  }


  // RETRIEVE THE FILTER ON SELECTOR CHANGE
  // AND SET THE NEW FILTERS
  changeDateFilter = (e) => {
    this.selectedFilters.ref_date = e.target.value
    this.filterData(this.selectedFilters)
  }
  changeLocationFilter = (e) => {
    this.selectedFilters.location = e.target.value
    this.filterData(this.selectedFilters)
  }
  changeAgeFilter = (e) => {
    this.selectedFilters.age = e.target.value
    this.filterData(this.selectedFilters)
  }
  changeGenderFilter = (e) => {
    this.selectedFilters.gender = e.target.value
    this.filterData(this.selectedFilters)
  }

  //FILTER DATA BASED ON THE SELECTED FILTERS
  filterData = (filters) => {
    this.defaultChartConfig.options.resolution = (filters.location === 'Canada') ? '' : 'provinces'
    this.defaultChartConfig.options.region = (filters.location === 'Canada') ? 'world' : 'CA'

    if(filters.location === 'All Provinces') {
      this.filteredData = this.rawData.filter(data =>  
        data.REF_DATE === filters.ref_date
        && data.GEO !== 'Canada'
        && data.Age === filters.age
        && data.Gender === filters.gender
      )
    }
    else {
      this.filteredData = this.rawData.filter(data => 
        data.REF_DATE === filters.ref_date
        && data.GEO === filters.location
        && data.Age === filters.age
        && data.Gender === filters.gender
      )
    }    
    this.dataForChart(this.filteredData)
  }
  
  //SELECT THE COLUMNS NEEDED FOR THE GEOCHART
  dataForChart = (data) => {
    this.defaultChartConfig.dataList = data.map(data => ([
      data.GEO,
      parseInt(data.VALUE)
    ]))
    this.isLoaded = true
  }

  

}
