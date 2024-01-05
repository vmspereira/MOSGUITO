import React from 'react';
import ExperimentsTable from "../components/ExperimentsTable";
import {Text} from "react-native"

const Experiments = ({ experiments, setExperiments }) => {
  return (
      <div>
        <ExperimentsTable
          experiments={experiments}
          setExperiments={setExperiments}
        />
        <Text style={{textAlign:'left', color:'white', margin:'2px', fontSize: 15}}>{`
          Files: if two files set as "path/to/mg_R1.fq.gz,path/to/mg_R2.fq.gz". If one file, set as "path/to/mg.fq.gz".
          
          Sample: relates all files to the same assembly, annotation and binning.
          
          Data type: dna - metagenomics; mrna - metatranscriptomics; protein - metaproteomics.
          
          Condition: if same condition, will be considered replicates.
          
          Name: used to organize output files, if left blank MOSCA will auto-assign based on input filename.
        `}</Text>
      </div>
  )
}

export default Experiments;