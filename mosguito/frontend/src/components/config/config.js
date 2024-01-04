import React from 'react'
import YAML from 'yaml'
import {
  CardActions
} from '@material-ui/core'
import { Row, Col} from "rsuite";
import { Button } from 'react-bootstrap'
import LabelledTextField from "./LabelledTextField"
import LabelledNumberField from "./LabelledNumberField"
import LabelledCheckbox from "./LabelledCheckbox"
import LabelledSelect from "./LabelledSelect"
import { defaultValues } from './utils/defaultValues'
import { emptyValues } from './utils/emptyValues'
import download from './utils/download'
import {
  assemblerOptions,
  errorModelOptions,
  markersetOptions,
  normalizationMethodOptions,
  keggcharterTaxaLevelOptions,
  upimapiDatabasesOptions,
  recognizerDatabasesOptions,
  proteomicsWorkflowOptions,
  referenceProteomesTaxaLevelOptions,
  proteaseOptions
} from './utils/options'

//import {DashboardLayout} from "../components/Layout";
import Accordion from "./Accordion";
import { Steps } from 'rsuite';


const Main = ({ configData, onConfigChange, onConfigOverwrite, hasMt, toggleHasMt, hasMp, toggleHasMp }) => {

  const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

  const [step, setStep] = React.useState(0);
  const onChange = nextStep => {
    setStep(nextStep < 0 ? 0 : nextStep > 5 ? 5 : nextStep);
  };

  const onNext = () => onChange(step + 1);
  const onPrevious = () => onChange(step - 1);


  const downloadJson = (ev) => {
    ev.preventDefault()
    if (configData['doAssembly']) { onConfigChange('errorModel', 'complete') }
    const snake_case_values = {}
    Object.keys(configData).map((key) => snake_case_values[camelToSnakeCase(key)] = configData[key])
    download(JSON.stringify(snake_case_values, null, 2), 'config.json', 'json')
  }

  const downloadYaml = (ev) => {
    ev.preventDefault()
    if (configData['doAssembly']) { onConfigChange('errorModel', 'complete') }
    const snake_case_values = {}
    Object.keys(configData).map((key) => snake_case_values[camelToSnakeCase(key)] = configData[key])
    download(YAML.stringify(snake_case_values, null), 'config.yaml', 'yaml')
  }

  const handleCheck = value => {
    const newList = [...configData.recognizerDatabases]

    const index = newList.indexOf(value)
    if (index > -1) {
      newList.splice(index, 1)
    } else {
      newList.push(value)
    }

    onConfigChange('recognizerDatabases', newList)
  }

  return (
    <main>
      <div style={{ height: "40px" }}></div>
      <form>
        <div>
          <Button className="m-2"
            onClick={() => onConfigOverwrite(defaultValues)}
            variant="dark"
          >
            Set to default values
          </Button>

          <Button className="m-2"
            onClick={() => onConfigOverwrite(emptyValues)}
            variant="dark"
          >
            Clear values
          </Button>

          <Button className="m-2"
            onClick={(ev) => downloadYaml(ev)}
            variant="secondary"
          >
            Download YAML
          </Button>

          <Button className="m-2"
            onClick={(ev) => downloadJson(ev)}
            variant="secondary"
          >
            Download JSON
          </Button>

          <p className='align-middle m-4'>MOSCA {configData.version}</p>

        </div>

        <div>
          <Steps className="container mt-5" current={step} vertical>
            <Steps.Item title={<div className=" fw-light align-items-top" style={{ fontSize: "18px" }}>
              <b>General Configuration</b></div>}
              description=
              {step === 0 &&
                <div>
                  <LabelledTextField
                    label='Output directory'
                    value={configData.output}
                    onChange={(ev) => onConfigChange('output', ev.target.value)}
                    placeholder={defaultValues.output}
                    helpMessage='The directory where the output files will be written'
                  />

                  <LabelledTextField
                    label='Resources directory'
                    value={configData.resourcesDirectory}
                    onChange={(ev) => onConfigChange('resourcesDirectory', ev.target.value)}
                    placeholder={defaultValues.resourcesDirectory}
                    helpMessage='The directory where supporting files will be stored'
                  />

                  <LabelledNumberField
                    label='Number of threads to use'
                    value={configData.threads}
                    onChange={(ev) => onConfigChange('threads', ev.target.valueAsNumber)}
                    helpMessage='The number of threads to use for the analysis'
                  />

                  <LabelledNumberField
                    label='Maximum memory (Gb)'
                    value={configData.maxMemory}
                    onChange={(ev) => onConfigChange('maxMemory', ev.target.valueAsNumber)}
                    helpMessage='The maximum amount of memory to use for the analysis'
                  />


                  <div className='mt-4 mb-5'><h5>Preprocessing settings</h5></div>
                  <LabelledNumberField
                    label='Minimum read length'
                    value={configData.minimumReadLength}
                    onChange={(ev) => onConfigChange('minimumReadLength', ev.target.valueAsNumber)}
                    helpMessage='The minimum read length to keep. Reads shorter than this will be discarded.'
                  />

                  <LabelledNumberField
                    label='Minimum read average quality'
                    value={configData.minimumReadAverageQuality}
                    onChange={(ev) => onConfigChange('minimumReadAverageQuality', ev.target.valueAsNumber)}
                    helpMessage='The minimum average quality of the reads to keep. Reads with an average quality lower than this will be discarded.'
                  />

                  <div className='mt-4 mb-5'><h5>Assembly settings</h5></div>

                  <LabelledCheckbox
                    label='Perform assembly'
                    checked={configData.doAssembly}
                    setChecked={(ev) => onConfigChange('doAssembly', ev.target.checked)}
                    helpMessage='Whether to perform assembly. If unchecked, assembly and binning will be skipped, and gene calling will be performed directly on the reads.'
                  />

                  {
                    configData.doAssembly ? (
                      <>
                        <LabelledSelect
                          label='Assembler'
                          value={configData.assembler}
                          onChange={(ev) => onConfigChange('assembler', ev.target.value)}
                          options={assemblerOptions}
                          helpMessage='The assembler to use for the assembly. MetaSPAdes and Megahit are recommended for metagenomics, while Trinity and rnaSPAdes are recommended for RNA-Seq anaysis.'
                        />

                        <div className='mt-4 mb-5'><h5>Binning settings</h5></div>

                        <LabelledCheckbox
                          label='Perform iterative binning'
                          checked={configData.doIterativeBinning}
                          setChecked={(ev) => onConfigChange('doIterativeBinning', ev.target.checked)}
                          helpMessage='Whether to perform iterative binning. If unchecked, binning will be performed once for default parameters, if checked, iterative binning will cycle through different parameters to obtain better binning results.'
                        />

                        <LabelledSelect
                          label='Markergene set'
                          value={configData.markerset}
                          onChange={(ev) => onConfigChange('markerset', ev.target.value)}
                          options={markersetOptions}
                          helpMessage="Use '107' if the analysis is limited to Bacteria, '40' if Archaea are to be considered."
                        />
                      </>
                    ) : (<></>)
                  }

                  <div className='mt-4 mb-5'><h5>
                    Annotation settings
                  </h5></div>

                  {
                    configData.doAssembly ? (<></>) : (
                      <LabelledSelect
                        label='Error model'
                        value={configData.errorModel}
                        onChange={(ev) => onConfigChange('errorModel', ev.target.value)}
                        options={errorModelOptions}
                        helpMessage='The error model to consider in gene calling, when not performing assembly. _5 and _10 represent expected 5% and 10% of erroneous base calls.'
                      />
                    )
                  }

                  <LabelledSelect
                    label='UPIMAPI database'
                    value={configData.upimapiDatabase}
                    onChange={(ev) => onConfigChange('upimapiDatabase', ev.target.value)}
                    options={upimapiDatabasesOptions}
                    helpMessage='Database to use as reference for sequence-homology annotation of genes identified.'
                  />

                  {
                    configData.upimapiDatabase === 'taxids' ? (
                      <LabelledTextField
                        label='Tax IDs (comma-separated)'
                        value={configData.upimapiTaxids}
                        onChange={(ev) => onConfigChange('upimapiTaxids', ev.target.value)}
                        placeholder={defaultValues.upimapiTaxids}
                        helpMessage='Comma-separated list of Tax IDs to use as reference for sequence-homology annotation.'
                      />) : (<></>)
                  }

                  <LabelledNumberField
                    label='Identifications per protein'
                    value={configData.diamondMaxTargetSeqs}
                    onChange={(ev) => onConfigChange('diamondMaxTargetSeqs', ev.target.valueAsNumber)}
                    helpMessage='Number of identifications per gene to report from sequence-homology annotation.'
                  />

                  <div style={{ margin: '1rem 0' }}>
                    <Accordion
                      title="Pick databases of reCOGnizer"
                      helpMessage='Databases to use as reference for domain-homology annotation of genes identified.'
                    >
                      {
                        recognizerDatabasesOptions.map((value, index) => (
                          <LabelledCheckbox
                            key={index}
                            label={value}
                            checked={configData.recognizerDatabases.indexOf(value) > -1}
                            setChecked={(ev) => handleCheck(value)}
                            variant="filled"
                          />
                        )
                        )
                      }
                    </Accordion>
                  </div>

                  <LabelledCheckbox
                    label='Download CDD resources'
                    checked={configData.downloadCddResources}
                    setChecked={(ev) => onConfigChange('downloadCddResources', ev.target.checked)}
                    helpMessage='Whether to download the CDD resources for domain-homology annotation with reCOGnizer. Select only if these files are not available in the folder "resources_directory" (usually when running MOSCA for the first time).'
                  />


                  <div className='mt-4 mb-5'><h5>
                    Differential expression settings
                  </h5></div>

                  <LabelledCheckbox
                    label='Data contains RNA-Seq'
                    checked={hasMt}
                    setChecked={(ev) => toggleHasMt()}
                    helpMessage='Whether the data contains RNA-Seq data. If unchecked, differential expression will be skipped.'
                  />

                  {
                    hasMt ? (
                      <>
                        <LabelledSelect
                          label='Normalization method'
                          value={configData.normalizationMethod}
                          onChange={(ev) => onConfigChange('normalizationMethod', ev.target.value)}
                          options={normalizationMethodOptions}
                          helpMessage='The normalization method to use for gene expression.'
                        />

                        <LabelledNumberField
                          label='Minimum differential expression'
                          value={configData.minimumDifferentialExpression}
                          onChange={(ev) => onConfigChange('minimumDifferentialExpression', ev.target.valueAsNumber)}
                          step={0.1}
                          minimum={0.1}
                          helpMessage='The minimum differential expression to test the null hypothesis, i.e., to determine if a difference in expression is relevant enough.'
                        />

                      </>
                    ) : (<></>)
                  }

                  <div className='mt-4 mb-5'><h5>
                    Proteomics settings
                  </h5></div>

                  <LabelledCheckbox
                    label='Data contains MS spectra'
                    checked={hasMp}
                    setChecked={(ev) => toggleHasMp()}
                    helpMessage='Whether the data contains MS spectra. If unchecked, proteomics analysis will be skipped.'
                  />
                  {
                    hasMp ? (
                      <>
                        <LabelledSelect
                          label='Proteomics workflow'
                          value={configData.proteomicsWorkflow}
                          onChange={(ev) => onConfigChange('proteomicsWorkflow', ev.target.value)}
                          options={proteomicsWorkflowOptions}
                          helpMessage='The proteomics workflow to use for proteomics analysis.'
                        />

                        <LabelledCheckbox
                          label='Use cRAP database'
                          checked={configData.useCrap}
                          setChecked={(ev) => onConfigChange('useCrap', ev.target.checked)}
                          helpMessage='Whether to use the cRAP database automatically retrieved by MOSCA, or use a custom contaminants database.'
                        />

                        {
                          configData.useCrap ? (<></>) : (
                            <LabelledTextField
                              label='Contaminants database'
                              value={configData.proteomicsContaminantesDatabase}
                              onChange={(ev) => onConfigChange('proteomicsContaminantesDatabase', ev.target.value)}
                              placeholder={defaultValues.proteomicsContaminantesDatabase}
                              helpMessage='The custom contaminants database to use for proteomics analysis.'
                            />
                          )
                        }

                        <LabelledSelect
                          label='Get proteomes for level'
                          value={configData.referenceProteomesTaxaLevel}
                          onChange={(ev) => onConfigChange('referenceProteomesTaxaLevel', ev.target.value)}
                          options={referenceProteomesTaxaLevelOptions}
                          helpMessage='The taxonomic level for which to retrieve reference proteomes, based on taxonomic characterization obtained with MetaPhlan2.'
                        />

                        <LabelledSelect
                          label='Protease used'
                          value={configData.protease}
                          onChange={(ev) => onConfigChange('protease', ev.target.value)}
                          options={proteaseOptions}
                          helpMessage='The protease used in wet-lab proteomics analysis. If not in the list, select "File" and input the filename of the protease sequence in FASTA format.'
                        />
                        {
                          ((configData.protease) !== "File") ? (<></>) : (
                            <LabelledTextField
                              label='Protease FASTA file'
                              value={configData.proteaseFile}
                              onChange={(ev) => onConfigChange('proteaseFile', ev.target.value)}
                              placeholder={defaultValues.proteaseFile}
                              helpMessage='The filename of the protease sequence in FASTA format.'
                            />
                          )
                        }
                      </>
                    ) : (<></>)
                  }

                  <div className='mt-4 mb-5'><h5>
                    KEGG metabolic maps settings
                  </h5></div>

                  <LabelledSelect
                    label='KEGG maps taxonomic level'
                    value={configData.keggcharterTaxaLevel}
                    onChange={(ev) => onConfigChange('keggcharterTaxaLevel', ev.target.value)}
                    options={keggcharterTaxaLevelOptions}
                    helpMessage='The taxonomic level at which genomic potential should be represented with KEGGCharter.'
                  />

                  <LabelledNumberField
                    label='KEGG maps number of taxa'
                    value={configData.keggcharterNumberOfTaxa}
                    onChange={(ev) => onConfigChange('keggcharterNumberOfTaxa', ev.target.valueAsNumber)}
                    helpMessage='The number of most abundant taxa for which genomic potential should be represented with KEGGCharter.'
                  />

                </div>
              } />

            <Steps.Item title={<div className=" fw-light align-items-top" style={{ fontSize: "18px" }}>
              <b>Uniprot Columns</b></div>}
              description=
              {step === 1 &&
                <div>

                </div>
              } />

            <Steps.Item title={<div className=" fw-light align-items-top" style={{ fontSize: "18px" }}>
              <b>Uniprot Databases</b></div>}
              description=
              {step === 2 &&
                <div>

                </div>
              } />

            <Steps.Item title={<div className=" fw-light align-items-top" style={{ fontSize: "18px" }}>
              <b>KEGG Metabolic Maps</b></div>}
              description=
              {step === 3 &&
                <div>

                </div>
              } />

            <Steps.Item title={<div className=" fw-light align-items-top" style={{ fontSize: "18px" }}>
              <b>Experiments</b></div>}
              description=
              {step === 4 &&
                <div>

                </div>
              } />

            <Steps.Item title={<div className=" fw-light align-items-top" style={{ fontSize: "18px" }}>
              <b>Run</b></div>}
              description=
              {step === 5 &&
                <Col>
                  <Row><Button variant="dark">Run the Configuration</Button></Row>
                </Col>
              } />

          </Steps>
          <hr />

          <div>
            <Button className="m-4" onClick={onPrevious} disabled={step === 0} variant="dark">
              Previous Step
            </Button>
            <Button className="m-4" onClick={onNext} disabled={step === 5} variant="dark">
              Next Step
            </Button>
          </div>
        </div>
      </form>
    </main>
  )
}

function Config({ configData, onConfigChange, onConfigOverwrite, hasMt, toggleHasMt, hasMp, toggleHasMp }) {
  return (
    <div>
      <Main
        configData={configData}
        onConfigChange={onConfigChange}
        onConfigOverwrite={onConfigOverwrite}
        hasMt={hasMt}
        toggleHasMt={toggleHasMt}
        hasMp={hasMp}
        toggleHasMp={toggleHasMp}
      />
    </div>
  )
}

export default Config
