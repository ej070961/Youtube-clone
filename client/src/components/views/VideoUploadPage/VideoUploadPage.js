import React, {useState} from 'react'
import Auth from '../../../hoc/auth';
import { Typography, Button, Form, message, Input} from 'antd';
import Icon from '@ant-design/icons';
import axios from 'axios'
import { useSelector } from 'react-redux';
import {useDropzone} from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
const {TextArea} = Input;
const {Title} = Typography;

//Option을 위한 key, value 정의 
const PrivateOptions = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' }
]

const CategoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" },
    { value: 4, label: "Sports" },
]

function VideoUploadPage() {
    const user = useSelector(state => state.User); //리덕스 state에서 user정보를 가져와 user 변수에 담음 
    const navigate = useNavigate();

    //state 만들기 > value를 저장하고, 서버에 보내기 위함 
    const [VideoTitle, setVideoTitle] = useState(""); //title 
    const [Description, setDescription] = useState(""); //description 
    const [Private, setPrivate] = useState(0) //private, public 설정 
    const [Categories, setCategories] = useState("Film & Animation") //카테고리
    const [FilePath, setFilePath] = useState("") //비디오 파일 경로
    const [Duration, setDuration] = useState("") //비디오 러닝타임
    const [Thumbnail, setThumbnail] = useState("") //썸네일 파일 경로  

    //각각의 state 값을 바꿔주는 함수 
    const onTitleChange = (event) => {
        setVideoTitle(event.currentTarget.value)
    }

    const onDescriptionChange = (event) => {
        setDescription(event.currentTarget.value)
    }

    const onPrivateChange = (event) => {
        setPrivate(event.currentTarget.value)
    }

    const onCategoryChange = (event) => {
        setCategories(event.currentTarget.value)
    }

    //onSumit 함수 
    const onSubmit = (event) => {
        //HTML 이벤트의 기본 동작을 방지하여 원치 않는 동작이 발생하는 것을 막음 
        event.preventDefault();

        if (user.userData && !user.userData.isAuth) {
            return alert('Please Log in First')
        }

        if (VideoTitle === "" || Description === "" ||
            Categories === "" || FilePath === "" ||
            Duration === "" || Thumbnail === "") {
            return alert('Please first fill all the fields')
        }
        //저장해야할 정보를 변수에 저장 
        const variables = {
            writer: user.userData._id, //리덕스 state를 통해 가져온 user 정보로부터 userData로부터_id 정보를 가져옴 
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Categories,
            duration: Duration,
            thumbnail: Thumbnail
        }
        //서버에 저장 요청  
        axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    alert('video Uploaded Successfully');
                    navigate('/');
                } else {
                    alert('Failed to upload video')
                }
            })

    }

    const onDrop = (files) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }//Axios를 통해 서버에 보낼때 header에 content-type을 적어줘야 오류가 발생하지 않음 
        console.log(files)
        formData.append("file", files[0])

        axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                //response가 성공일 때 
                if (response.data.success) {
                    console.log(response.data)
                    //파일 업로드 성공시 파일 경로와 파일 이름을 변수로 저장하여 썸네일을 만들기 위해 서버로 보내줌 
                    let variable = {
                        filePath: response.data.filePath,
                        fileName: response.data.fileName
                    }
                    // console.log(response.data.filePath);
                    // console.log(response.data.fileName);
                    setFilePath(response.data.filePath)

                    //gerenate thumbnail with this filepath ! 
                    axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {
                                console.log(response.data)
                                setDuration(response.data.fileDuration)
                                setThumbnail(response.data.thumbsFilePath)
                                console.log(Thumbnail)
                            } else {
                                alert('Failed to make the thumbnails');
                            }
                        })


                } else {
                    alert('failed to save the video in server') //response가 실패일 때 
                }
            })

    }
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onDrop,
        multiple: false,
        maxSize: 800000000
      });

  return (
    <div style={{maxWidth:'700px', margin:'2rem auto'}}>
        <div style={{textAlign:'center', marginBottom:'2rem'}}>
            <Title level={2}>Upload Video</Title>
        </div>

        <Form>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/*Dropzone*/}
                    <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Icon type="plus" style={{ fontSize: '3rem' }} />

                    </div>


                    {/*Thumbnail*/}
                    {/*썸네일 경로가 있을 때에만 썸네일 경로를 이용해 화면에 썸네일을 렌더링함 */}
                    {Thumbnail !== "" &&
                        <div>
                            <img src={`http://localhost:5000/${Thumbnail}`} alt="haha" />
                        </div>
                    }
                </div>

                <br />
                <br />
                {/*영상 타이틀 입력*/}
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />
                {/*Description입력*/}
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br />
                <br />

                {/*Private/public 선택 */}
                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                {/*카테고리 선택 */}
                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.label}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <Button type="primary" size="large" onClick={onSubmit} >
                    Submit
                </Button>

            </Form>
        </div>
  )
}

export default Auth(VideoUploadPage, true)