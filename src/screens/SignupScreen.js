import { useState } from "react";
import { SafeAreaView, ScrollView, Text, TextInput, View, } from "react-native";
export default (props) => {
	const [textInput1, onChangeTextInput1] = useState('');
	const [textInput2, onChangeTextInput2] = useState('');
	const [textInput3, onChangeTextInput3] = useState('');
	return (
		<SafeAreaView 
			style={{
				flex: 1,
				backgroundColor: "#FFFFFF",
			}}>
			<ScrollView  
				style={{
					flex: 1,
					backgroundColor: "#F9FAFB",
					shadowColor: "#00000040",
					shadowOpacity: 0.3,
					shadowOffset: {
					    width: 0,
					    height: 4
					},
					shadowRadius: 4,
					elevation: 4,
				}}>
				<View 
					style={{
						backgroundColor: "#83A3B5",
						paddingTop: 89,
						paddingBottom: 68,
						paddingLeft: 110,
						paddingRight: 36,
						marginBottom: 53,
					}}>
					<Text 
						style={{
							color: "#000000",
							fontSize: 48,
							width: 195,
						}}>
						{"☾ LUNAR"}
					</Text>
				</View>
				<Text 
					style={{
						color: "#020202",
						fontSize: 24,
						fontWeight: "bold",
						marginBottom: 63,
						marginLeft: 35,
					}}>
					{"Sign Up with"}
				</Text>
				<TextInput
					placeholder={"EMAIL"}
					value={textInput1}
					onChangeText={onChangeTextInput1}
					style={{
						color: "#928989",
						fontSize: 15,
						marginBottom: 27,
						marginLeft: 35,
						alignSelf: "flex-start",
						backgroundColor: "#FFFFFF",
						borderColor: "#000000",
						borderRadius: 10,
						borderWidth: 1,
						paddingVertical: 8,
						paddingHorizontal: 129,
						shadowColor: "#00000040",
						shadowOpacity: 0.3,
						shadowOffset: {
						    width: 0,
						    height: 4
						},
						shadowRadius: 4,
						elevation: 4,
					}}
				/>
				<Text 
					style={{
						color: "#000000",
						fontSize: 15,
						marginBottom: 34,
						marginLeft: 176,
					}}>
					{"OR"}
				</Text>
				<TextInput
					placeholder={"MOBILE NUMBER"}
					value={textInput2}
					onChangeText={onChangeTextInput2}
					style={{
						color: "#928989",
						fontSize: 15,
						marginBottom: 2,
						marginLeft: 35,
						alignSelf: "flex-start",
						backgroundColor: "#FFFFFF",
						borderColor: "#000000",
						borderRadius: 10,
						borderWidth: 1,
						paddingVertical: 9,
						paddingHorizontal: 102,
						shadowColor: "#00000040",
						shadowOpacity: 0.3,
						shadowOffset: {
						    width: 0,
						    height: 4
						},
						shadowRadius: 4,
						elevation: 4,
					}}
				/>
				<View 
					style={{
						alignItems: "flex-end",
						marginBottom: 63,
					}}>
					<Text 
						style={{
							color: "#EEF6FF",
							fontSize: 12,
							fontWeight: "bold",
							marginRight: 74,
						}}>
						{"Forgotten Password?"}
					</Text>
				</View>
				<View 
					style={{
						height: 1,
						backgroundColor: "#BEBDBD",
						marginBottom: 59,
						marginHorizontal: 43,
					}}>
				</View>
				<TextInput
					placeholder={"CREATE ACCOUNT"}
					value={textInput3}
					onChangeText={onChangeTextInput3}
					style={{
						color: "#928989",
						fontSize: 15,
						marginBottom: 110,
						marginLeft: 38,
						alignSelf: "flex-start",
						backgroundColor: "#FFFFFF",
						borderColor: "#1C1515",
						borderRadius: 3,
						borderWidth: 1,
						paddingVertical: 10,
						paddingHorizontal: 99,
					}}
				/>
			</ScrollView>
		</SafeAreaView>
	)
}
